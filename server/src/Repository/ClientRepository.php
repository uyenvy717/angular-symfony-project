<?php

namespace App\Repository;

use App\Entity\Client;
use App\Entity\GrowthPartner;
use App\Entity\Partner;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Client>
 */
class ClientRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Client::class);
    }

    public function findClientsByPartner(?Partner $partner): array
    {
        if (!$partner) {
            return [];
        }

        $query = $this->createQueryBuilder('c');

        if ($partner instanceof GrowthPartner) {
            $query->where('c.partner = :partner')
                ->orWhere('c.partner IN (
                SELECT a FROM App\Entity\AffiliatePartner a WHERE a.registeredPartner = :partner
            )')
                ->orWhere('c.partner IN (
                SELECT spa FROM App\Entity\SolutionPartner spa WHERE spa.registeredPartner = :partner
            )')
                ->orWhere('c.partner IN (
                SELECT spr FROM App\Entity\SolutionProvider spr WHERE spr.registeredPartner = :partner
            )')
                ->setParameter('partner', $partner);
        } else {
            $query->where('c.partner = :partner')
                ->setParameter('partner', $partner);
        }

        return $query->getQuery()->getResult();
    }

    public function findClientsByPartnerId(string $partnerId): array
    {
        $partner = $this->getEntityManager()
            ->getRepository(Partner::class)
            ->find($partnerId);

        if (!$partner) {
            return [];
        }

        return $this->findClientsByPartner($partner);
    }
}

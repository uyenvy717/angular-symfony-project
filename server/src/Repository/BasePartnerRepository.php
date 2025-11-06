<?php

namespace App\Repository;

use App\Entity\GrowthPartner;
use App\Entity\Partner;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

abstract class BasePartnerRepository extends ServiceEntityRepository
{
    /**
     * Fetch partners, filtered by the logged-in user's registered partner (if not super admin).
     */
    public function findByPartner(?Partner $partner): array
    {
        $query = $this->createQueryBuilder('p');

        if ($partner) {
            $query->where('p.registeredPartner = :partner')
                ->setParameter('partner', $partner);
        }

        return $query->getQuery()->getResult();
    }

    /**
     * Find partners by registered partner ID
     * @param string $partnerId
     * @return array
     */
    public function findByRegisteredPartnerId(string $partnerId): array
    {
        $partner = $this->getEntityManager()
            ->getRepository(GrowthPartner::class)
            ->find($partnerId);
            
        if (!$partner) {
            return [];
        }

        return $this->findByPartner($partner);
    }
}

<?php

namespace App\Repository;

use App\Entity\GrowthPartner;
use App\Entity\Partner;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function findUsersByPartner(?Partner $partner): array
    {
        $query = $this->createQueryBuilder('u');

        if ($partner) {
            if ($partner instanceof GrowthPartner) {
                $query->where('u.partner = :partner')
                    ->orWhere('u.partner IN (
                    SELECT a FROM App\Entity\AffiliatePartner a WHERE a.registeredPartner = :partner
                )')
                    ->orWhere('u.partner IN (
                    SELECT spa FROM App\Entity\SolutionPartner spa WHERE spa.registeredPartner = :partner
                )')
                    ->orWhere('u.partner IN (
                    SELECT spr FROM App\Entity\SolutionProvider spr WHERE spr.registeredPartner = :partner
                )')
                    ->setParameter('partner', $partner);
            } else {
                $query->where('u.partner = :partner');
            }

        }

        return $query->getQuery()->getResult();
    }
}

<?php

namespace App\Repository;

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
        if (!$partner) {
            return [];
        }

        $query = $this->createQueryBuilder('u');

        $query->where('u.partner = :partner')
            ->setParameter('partner', $partner);

        return $query->getQuery()->getResult();
    }

    public function findUsersByPartnerId(string $partnerId): array
    {
        $partner = $this->getEntityManager()
            ->getRepository(Partner::class)
            ->find($partnerId);

        return $this->findUsersByPartner($partner);
    }
}

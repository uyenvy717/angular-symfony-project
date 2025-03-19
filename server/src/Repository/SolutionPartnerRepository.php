<?php

namespace App\Repository;

use App\Entity\SolutionPartner;
use Doctrine\Persistence\ManagerRegistry;

class SolutionPartnerRepository extends BasePartnerRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SolutionPartner::class);
    }
}

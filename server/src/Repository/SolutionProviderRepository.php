<?php

namespace App\Repository;

use App\Entity\SolutionProvider;
use Doctrine\Persistence\ManagerRegistry;

class SolutionProviderRepository extends BasePartnerRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SolutionProvider::class);
    }
}

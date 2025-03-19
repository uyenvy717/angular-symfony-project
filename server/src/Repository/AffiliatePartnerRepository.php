<?php

namespace App\Repository;

use App\Entity\AffiliatePartner;
use Doctrine\Persistence\ManagerRegistry;

class AffiliatePartnerRepository extends BasePartnerRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AffiliatePartner::class);
    }
}

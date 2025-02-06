<?php

namespace App\Repository;

use App\Entity\Partner;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Partner>
 */
class PartnerRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Partner::class);
    }

    public function findAllGrowthPartnerClient($gpId): array
    {
        return $results = $this->createQueryBuilder('p')
            ->leftJoin('App\Entity\GrowthPartnerClient', 'grpc', 'WITH', 'grpc.registeredPartner = p.id')
            ->addSelect('grpc')
            ->leftJoin('App\Entity\GeneralPartner', 'gep', 'WITH', 'gep.registeredPartner = p.id')
            ->addSelect('gep.id as generalPartnerId')
            ->leftJoin('App\Entity\SolutionPartnerClient', 'spac', 'WITH', 'spac.registeredPartner = gep.id')
            ->addSelect('spac')
            ->leftJoin('App\Entity\SolutionProviderClient', 'sprc', 'WITH', 'sprc.registeredPartner = gep.id')
            ->addSelect('sprc')
            ->leftJoin('App\Entity\AffiliatePartnerClient', 'apc', 'WITH', 'apc.registeredPartner = gep.id')
            ->addSelect('apc')
//            ->leftJoin('App\Entity\GrowthPartnerClient', 'grpc', 'WITH', 'grpc.registeredPartner = p.id')
//            ->leftJoin('App\Entity\GeneralPartner', 'gep', 'WITH', 'gep.registeredPartner = p.id')
//            ->leftJoin('App\Entity\SolutionPartnerClient', 'spac', 'WITH', 'spac.registeredPartner = gep.id')
//            ->leftJoin('App\Entity\SolutionProviderClient', 'sprc', 'WITH', 'sprc.registeredPartner = gep.id')
//            ->leftJoin('App\Entity\AffiliatePartnerClient', 'apc', 'WITH', 'apc.registeredPartner = gep.id')
//            ->select('
//        TYPE(grpc) as growthClientType,
//        TYPE(spac) as solutionPartnerClientType,
//        TYPE(sprc) as solutionProviderClientType,
//        TYPE(apc) as affiliateClientType
//    ')
            ->where('p INSTANCE OF App\Entity\GrowthPartner')
            ->andWhere('p.id = :gpId')
            ->setParameter('gpId', $gpId)
            ->getQuery()
            ->getResult();

//        $clientTypes = [];
//        foreach ($results as $result) {
//            if ($result instanceof \App\Entity\GrowthPartnerClient) {
//                $clientTypes[] = 'GrowthPartnerClient';
//            }
//            if ($result instanceof \App\Entity\SolutionPartnerClient) {
//                $clientTypes[] = 'SolutionPartnerClient';
//            }
//            if ($result instanceof \App\Entity\SolutionProviderClient) {
//                $clientTypes[] = 'SolutionProviderClient';
//            }
//            if ($result instanceof \App\Entity\AffiliatePartnerClient) {
//                $clientTypes[] = 'AffiliatePartnerClient';
//            }
//        }
//
//        return $clientTypes;
    }

    //    /**
    //     * @return Partner[] Returns an array of Partner objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('p.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Partner
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}

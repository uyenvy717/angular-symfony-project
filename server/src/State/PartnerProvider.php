<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\SolutionPartner;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class PartnerProvider implements ProviderInterface
{
    private Security $security;
    private EntityManagerInterface $entityManager;

    public function __construct(Security $security, EntityManagerInterface $entityManager)
    {
        $this->security = $security;
        $this->entityManager = $entityManager;
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array|null|object
    {
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            throw new AccessDeniedException('Access Denied.');
        }

        $queryBuilder = $this->entityManager->getRepository(SolutionPartner::class)->createQueryBuilder('spa');

        if (!$this->security->isGranted('ROLE_SUPER_ADMIN')) {
            $queryBuilder
                ->where('spa.registeredPartner = :partner')
                ->setParameter('partner', $user->getPartner());
        }

        return $queryBuilder->getQuery()->getResult();
    }
}

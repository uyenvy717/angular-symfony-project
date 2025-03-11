<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class UserProvider implements ProviderInterface
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

        $queryBuilder = $this->entityManager->getRepository(User::class)->createQueryBuilder('u');

        if (!$this->security->isGranted('ROLE_SUPER_ADMIN')) {
            $queryBuilder
                ->where('u.partner = :partner')
                ->orWhere('u.partner IN (
                    SELECT a FROM App\Entity\AffiliatePartner a WHERE a.registeredPartner = :partner
                )')
                ->orWhere('u.partner IN (
                    SELECT spa FROM App\Entity\SolutionPartner spa WHERE spa.registeredPartner = :partner
                )')
                ->orWhere('u.partner IN (
                    SELECT spr FROM App\Entity\SolutionProvider spr WHERE spr.registeredPartner = :partner
                )')
                ->setParameter('partner', $user->getPartner());
        }

        return $queryBuilder->getQuery()->getResult();
    }
}

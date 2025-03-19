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

        if ($user === null) {
            throw new AccessDeniedException('Access Denied.');
        }

        // Get the repository for the User entity
        $userRepository = $this->entityManager->getRepository(User::class);


        // If the user is a super admin, just return all users
        if ($this->security->isGranted('ROLE_SUPER_ADMIN')) {
            return $userRepository->findAll();
        } else {
            return $userRepository->findUsersByPartner($user->getPartner());
        }
    }
}

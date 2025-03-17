<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Client;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class ClientProvider implements ProviderInterface
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
        $clientRepository = $this->entityManager->getRepository(Client::class);


        // If the user is a super admin, just return all clients
        if ($this->security->isGranted('ROLE_SUPER_ADMIN')) {
            return $clientRepository->findAll();
        } else {
            return $clientRepository->findClientsByPartner($user->getPartner());
        }
    }
}

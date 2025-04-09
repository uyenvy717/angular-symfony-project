<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class PartnerProvider implements ProviderInterface
{
    private Security $security;
    private EntityManagerInterface $entityManager;
    private string $entityClass;

    public function __construct(Security $security, EntityManagerInterface $entityManager, string $entityClass)
    {
        $this->security = $security;
        $this->entityManager = $entityManager;
        $this->entityClass = $entityClass;
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array|null|object
    {
        $user = $this->security->getUser();

        if ($user === null) {
            throw new AccessDeniedException('Access Denied.');
        }

        $repository = $this->entityManager->getRepository($this->entityClass);

        // Check if the route includes 'registeredPartnerId'
        if (isset($uriVariables['registeredPartnerId'])) {
            $registeredPartnerId = $uriVariables['registeredPartnerId'];
            
            // If not super admin, ensure user has access to this registered partner
            if (!$this->security->isGranted('ROLE_SUPER_ADMIN')) {
                throw new AccessDeniedException('Access to this partner is denied.');
            }

            // Use the repository method to filter by registered partner ID
            return $repository->findByRegisteredPartnerId($registeredPartnerId);
        }

        // If user is not a super admin, fetch only their assigned partners
        return $this->security->isGranted('ROLE_SUPER_ADMIN')
            ? $repository->findAll()
            : $repository->findByPartner($user->getPartner());
    }
}

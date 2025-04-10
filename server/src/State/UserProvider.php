<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\GrowthPartner;
use App\Entity\Partner;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Uid\Uuid;

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
        $partnerRepository = $this->entityManager->getRepository(Partner::class);

        // Check if the route includes 'registeredPartnerId'
        if (isset($uriVariables['registeredPartnerId'])) {
            $registeredPartnerId = $uriVariables['registeredPartnerId'];
            $userPartner = $user->getPartner();

            // If not super admin, ensure user has access to this registered partner
            if (!$this->security->isGranted('ROLE_SUPER_ADMIN')) {
                if ($userPartner instanceof GrowthPartner) {
                    $partner = $partnerRepository->find(Uuid::fromString($registeredPartnerId));
                    if (!$partner || $partner->getRegisteredPartner() !== $userPartner) {
                        throw new AccessDeniedException('Access to this partner is denied.');
                    }
                } else {
                    throw new AccessDeniedException('Access to this partner is denied.');
                }
            }

            // Use the repository method to filter by registered partner ID
            return $userRepository->findUsersByPartnerId($registeredPartnerId);
        }


        // If the user is a super admin, just return all users
        if ($this->security->isGranted('ROLE_SUPER_ADMIN')) {
            return $userRepository->findAll();
        } else {
            return $userRepository->findUsersByPartner($user->getPartner());
        }
    }
}

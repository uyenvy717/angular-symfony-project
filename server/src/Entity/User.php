<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Interface\IDable;
use App\Repository\UserRepository;
use App\State\UserProvider;
use App\Traits\IDScheme;
use Carbon\CarbonImmutable;
use DateTimeImmutable;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: "portal_user")]
#[ApiResource(
    operations: [
        new Get(
            normalizationContext: ['groups' => ['user:read']],
            security: "is_granted('ROLE_SUPER_ADMIN')
                or object.getPartner() == user.getPartner()
                or object.getPartner().getRegisteredPartner() == user.getPartner()"
        ),
        new GetCollection(
            normalizationContext: ['groups' => ['user:read']],
            provider: UserProvider::class
        ),
        new GetCollection(
            uriTemplate: '/users/by_registered_partner/{registeredPartnerId}',
            uriVariables: [
                'registeredPartnerId' => new Link(
                    fromProperty: 'users',
                    fromClass: Partner::class,
                    identifiers: ['id']
                )
            ],
            normalizationContext: ['groups' => ['user:read']],
            name: 'get_users_by_registered_partner',
            provider: UserProvider::class
        ),
        new Post(
            normalizationContext: ['groups' => ['user:read']],
            denormalizationContext: ['groups' => ['user:post:write']],
            securityPostDenormalize: "is_granted('ROLE_SUPER_ADMIN')
                or (is_granted('ROLE_ADMIN') and object.getPartner() == user.getPartner())
                or object.getPartner().getRegisteredPartner() and object.getPartner().getRegisteredPartner()  == user.getPartner()"
        ),
        new Patch(
            normalizationContext: ['groups' => ['user:read']],
            denormalizationContext: ['groups' => ['user:patch']],
            security: "is_granted('ROLE_SUPER_ADMIN')
                or (is_granted('ROLE_ADMIN') and object.getPartner() == user.getPartner())
                or object.getPartner().getRegisteredPartner() and object.getPartner().getRegisteredPartner()  == user.getPartner()"
        ),
    ]
)]
#[UniqueEntity(fields: ['name'], message: 'This name is already in use.')]
#[UniqueEntity(fields: ['email'], message: 'This email is already in use.')]
class User implements IDable, UserInterface, PasswordAuthenticatedUserInterface
{
    use IDScheme;
    #[ORM\Column]
    #[Groups(['user:patch'])]
    private bool $isActive;

    #[ORM\Column(length: 255, unique: true)]
    #[Groups(['user:read', 'user:post:write', 'user:patch'])]
    private string $name;

    #[ORM\Column(length: 255, unique: true)]
    #[Groups(['user:post:write'])]
    private string $email;

    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups(['user:read', 'user:post:write', 'user:patch'])]
    private ?array $roles = [];

    #[ORM\Column(type: 'string')]
    #[Groups(['user:post:write'])]
    private string $password;

    #[ORM\Column(type: Types::DATE_IMMUTABLE, nullable: true)]
    #[Groups(['user:read'])]
    private ?DateTimeImmutable $lastLoggedIn;

    #[ORM\ManyToOne(targetEntity: Partner::class, inversedBy: "users")]
    #[ORM\JoinColumn]
    #[Groups(['user:read', 'user:post:write', 'user:patch'])]
    private Partner $partner;

    /**
     * @param string $name
     * @param string $email
     * @param Partner $partner
     */
    public function __construct(string $name, string $email, Partner $partner)
    {
        $this->name = $name;
        $this->email = $email;
        $this->isActive = true;
        $this->lastLoggedIn = CarbonImmutable::now();
        $this->partner = $partner;
    }

    #[Groups(['user:read'])]
    public function isActive(): bool
    {
        return $this->isActive;
    }

    #[Groups(['user:read'])]
    public function getUserIdentifier(): string
    {
        return $this->email;
    }

    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(?array $roles): self
    {
        // If roles is null or empty, assign ROLE_USER
        if (empty($roles)) {
            $roles = ['ROLE_USER'];
        }
        $this->roles = $roles;

        return $this;
    }

    public function getLastLoggedIn(): ?DateTimeImmutable
    {
        return $this->lastLoggedIn;
    }

    public function getPartner(): Partner
    {
        return $this->partner;
    }

    public function setIsActive(bool $isActive): void
    {
        $this->isActive = $isActive;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function setEmail(string $email): void
    {
        $this->email = $email;
    }

    public function setLastLoggedIn(?DateTimeImmutable $lastLoggedIn): void
    {
        $this->lastLoggedIn = $lastLoggedIn;
    }

    public function setPartner(Partner $partner): void
    {
        $this->partner = $partner;
    }

    public function setPassword(string $password): void
    {
        $this->password = $password;
    }

    public function eraseCredentials(): void
    {
        // Implement eraseCredentials() method.
    }

    public function getPassword(): string
    {
        return $this->password;
    }
}

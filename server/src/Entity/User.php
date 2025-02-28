<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Interface\IDable;
use App\Repository\UserRepository;
use App\Traits\IDScheme;
use Carbon\Carbon;
use DateTimeInterface;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: "portal_user")]
#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(),
        new Post(
            denormalizationContext: ['groups' => ['user:post']],
            security: "is_granted('ROLE_SUPER_ADMIN')
                or (is_granted('ROLE_ADMIN') and object.getPartner() == user.getPartner())"
        ),
        new Patch(
            denormalizationContext: ['groups' => ['user:patch']],
            security: "is_granted('ROLE_SUPER_ADMIN')
                or ('ROLE_SUPER_ADMIN' not in object.getRoles() and is_granted('ROLE_ADMIN') and object.getPartner() == user.getPartner())
                or object.getPartner().getRegisteredPartner() and object.getPartner().getRegisteredPartner()  == user.getPartner()"
        ),
        new Delete()
    ]
)]
class User implements IDable, UserInterface, PasswordAuthenticatedUserInterface
{
    use IDScheme;
    #[ORM\Column]
    private bool $isActive;

    #[ORM\Column(length: 255)]
    private string $name;

    #[ORM\Column(length: 255)]
    private string $email;

    #[ORM\Column(type: 'json')]
    private array $roles = [];

    #[ORM\Column(type: 'string')]
    private string $password;


    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?DateTimeInterface $lastLoggedIn;

    #[ORM\ManyToOne(targetEntity: Partner::class, inversedBy: "users")]
    #[ORM\JoinColumn]
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
        $this->lastLoggedIn = Carbon::now();
        $this->partner = $partner;
    }

    public function isActive(): bool
    {
        return $this->isActive;
    }

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

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    public function getLastLoggedIn(): ?DateTimeInterface
    {
        return $this->lastLoggedIn;
    }

    public function getPartner(): Partner
    {
        return $this->partner;
    }

    #[Groups(['user:patch'])]
    public function setIsActive(bool $isActive): void
    {
        $this->isActive = $isActive;
    }

    #[Groups(['user:post', 'user:patch'])]
    public function setName(string $name): void
    {
        $this->name = $name;
    }

    #[Groups(['user:post'])]
    public function setEmail(string $email): void
    {
        $this->email = $email;
    }

    public function setLastLoggedIn(?DateTimeInterface $lastLoggedIn): void
    {
        $this->lastLoggedIn = $lastLoggedIn;
    }

    #[Groups(['user:post', 'user:patch'])]
    public function setPartner(?Partner $partner): void
    {
        $this->partner = $partner;
    }

    public function setPassword(string $password): void
    {
        $this->password = $password;
    }

    public function eraseCredentials(): void
    {
        // TODO: Implement eraseCredentials() method.
    }

    public function getPassword(): string
    {
        return $this->password;
    }
//
//    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
//    {
//        // TODO: Implement upgradePassword() method.
//    }
}

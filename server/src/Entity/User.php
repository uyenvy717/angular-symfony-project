<?php

namespace App\Entity;

use AllowDynamicProperties;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Interface\IDable;
use App\Repository\UserRepository;
use App\Traits\IDScheme;
use Carbon\Carbon;
use DateTimeInterface;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[AllowDynamicProperties]
#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: "portal_user")]
#[ApiResource(
    operations: [
        new Get(),
        new Post(
            denormalizationContext: ['groups' => ['user:post']],
        ),
        new Patch(
            denormalizationContext: ['groups' => ['user:patch']],
        ),
        new Delete()
    ]
)]
class User implements IDable
{
    use IDScheme;
    #[ORM\Column]
    private bool $isActive;

    #[ORM\Column(length: 255)]
    private string $name;

    #[ORM\Column(length: 255)]
    private string $email;

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

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getName(): string
    {
        return $this->name;
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
}

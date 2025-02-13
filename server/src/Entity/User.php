<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Interface\IDable;
use App\Repository\UserRepository;
use App\Traits\IDScheme;
use DateTimeInterface;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: "portal_user")]
#[ApiResource]
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
     * @param bool $isActive
     * @param DateTimeInterface|null $lastLoggedIn
     * @param Partner $partner
     */
    public function __construct(string $name, string $email, bool $isActive, ?DateTimeInterface $lastLoggedIn, Partner $partner)
    {
        $this->name = $name;
        $this->email = $email;
        $this->isActive = $isActive;
        $this->lastLoggedIn = $lastLoggedIn;
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
}

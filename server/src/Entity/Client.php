<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Interface\IDable;
use App\Repository\ClientRepository;
use App\Traits\IDScheme;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: ClientRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['read']],
    denormalizationContext: ['groups' => ['read']],
)]
class Client implements IDable
{
    use IDScheme;

    #[Groups(['read'])]
    #[ORM\Column]
    private bool $isActive;

    #[Groups(['read'])]
    #[ORM\Column(length: 255)]
    private string $name;

    #[Groups(['read'])]
    #[ORM\Column(length: 255)]
    private string $email;

    /**
     * a client can have a partner, but might not have one
     */
    #[ORM\ManyToOne(targetEntity: Partner::class, inversedBy: "clients")]
    #[ORM\JoinColumn(nullable: true)]
    private ?Partner $partner = null;

    /**
     * @param string $name
     * @param string $email
     * @param bool $isActive
     */
    public function __construct(string $name, string $email, bool $isActive)
    {

        $this->name = $name;
        $this->email = $email;
        $this->isActive = $isActive;
    }

    public function setPartner(?Partner $partner): void
    {
        $this->partner = $partner;
    }

    #[Groups(['read'])]
    public function getPartnerId(): ?string
    {
        return $this->partner?->getId()->toString();
    }


    public function isActive(): bool
    {
        return $this->isActive;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getEmail(): string
    {
        return $this->email;
    }
}

<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Interface\IDable;
use App\Repository\ClientRepository;
use App\Traits\IDScheme;
use Carbon\Carbon;
use DateTimeInterface;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: ClientRepository::class)]
#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(),
        new Post(
          denormalizationContext: ['groups' => ['client:post']]
        ),
        new Patch(
          denormalizationContext: ['groups' => ['client:patch']]
        ),
        new Delete()
    ],
    normalizationContext: ['groups' => ['client:read']]
)]
class Client implements IDable
{
    use IDScheme;

    #[ORM\Column]
    private bool $isActive;

    #[Groups(['client:read', 'client:patch', 'client:post'])]
    #[ORM\Column(length: 255)]
    private string $name;

    #[Groups(['client:read', 'client:post'])]
    #[ORM\Column(length: 255)]
    private string $email;

    #[Groups(['client:read', 'client:post'])]
    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private DateTimeInterface $startDate;

    /**
     * a client can have a partner, but might not have one
     */
    #[ORM\ManyToOne(targetEntity: Partner::class, inversedBy: "clients")]
    #[ORM\JoinColumn(nullable: true)]
    private ?Partner $partner;

    /**
     * @param string $name
     * @param string $email
     * @param bool $isActive
     * @param Partner|null $partner
     * @param DateTimeInterface|null $startDate
     */
    public function __construct(string $name, string $email, bool $isActive, ?Partner $partner, ?DateTimeInterface $startDate)
    {
        $this->name = $name;
        $this->email = $email;
        $this->isActive = $isActive;
        $this->partner = $partner ?? null;
        $this->startDate = $startDate ?? Carbon::now();
    }

    #[Groups(['client:read'])]
    public function isActive(): bool
    {
        return $this->isActive;
    }

    #[Groups(['client:patch', 'client:post'])]
    public function setIsActive(bool $isActive): void
    {
        $this->isActive = $isActive;
    }

    #[Groups(['client:patch', 'client:post'])]
    public function setPartner(?Partner $partner): void
    {
        $this->partner = $partner;
    }

    #[Groups(['client:read'])]
    public function getPartner(): ?Partner
    {
        return $this->partner;
    }

    #[Groups(['client:patch'])]
    public function setStartDate(?DateTimeInterface $startDate): void
    {
        $this->startDate = $startDate;
    }

    public function getStartDate(): DateTimeInterface
    {
        return $this->startDate;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function setEmail(string $email): void
    {
        $this->email = $email;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getRegisteredPartnerId(): ?string
    {
        return $this->partner?->getId()->toString();
    }
}

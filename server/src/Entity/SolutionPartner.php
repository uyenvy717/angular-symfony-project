<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\SolutionPartnerRepository;
use App\Traits\GeneralPartnerTrait;
use DateTimeInterface;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: SolutionPartnerRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['read']],
    denormalizationContext: ['groups' => ['read']],
)]
class SolutionPartner extends Partner
{
    use GeneralPartnerTrait;

    #[ORM\ManyToOne(targetEntity: GrowthPartner::class, inversedBy: "solutionPartners")]
    #[ORM\JoinColumn(nullable: true)]
    private ?GrowthPartner $registeredPartner;

    #[ORM\OneToMany(targetEntity: User::class, mappedBy: "solutionPartner")]
    private Collection $users;

    /**
     * @param string $name
     * @param string $email
     * @param GrowthPartner|null $registeredPartner
     * @param string|null $contactPerson
     * @param DateTimeInterface $startDate
     * @param DateTimeInterface|null $endDate
     * @param int|null $renewalInterval
     */
    public function __construct(string $name, string $email, ?GrowthPartner $registeredPartner, ?string $contactPerson, DateTimeInterface $startDate, ?DateTimeInterface $endDate, ?int $renewalInterval)
    {
        parent::__construct($name, $email);
        $this->registeredPartner = $registeredPartner;
        $this->contactPerson = $contactPerson;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->renewalInterval = $renewalInterval;
    }

    public function setRegisteredPartner(?GrowthPartner $partner): void
    {
        $this->registeredPartner = $partner;
    }

    #[Groups(['read'])]
    public function getRegisteredPartnerId(): ?string
    {
        return $this->registeredPartner?->getId()->toString();
    }

    #[Groups(['read'])]
    public function getUsers(): array
    {
        return $this->users->toArray();
    }
}

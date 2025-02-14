<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\GrowthPartnerRepository;
use DateTimeInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: GrowthPartnerRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['read']],
    denormalizationContext: ['groups' => ['write']],
)]
class GrowthPartner extends Partner
{
    #[Groups(['read'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $contactPerson;

    #[Groups(['read'])]
    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private DateTimeInterface $startDate;

    #[Groups(['read'])]
    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?DateTimeInterface $endDate;

    #[Groups(['read'])]
    #[ORM\OneToMany(targetEntity: SolutionPartner::class, mappedBy: 'registeredPartner')]
    private Collection $solutionPartners;

    #[Groups(['read'])]
    #[ORM\OneToMany(targetEntity: SolutionProvider::class, mappedBy: 'registeredPartner')]
    private Collection $solutionProviders;

    #[Groups(['read'])]
    #[ORM\OneToMany(targetEntity: AffiliatePartner::class, mappedBy: 'registeredPartner')]
    private Collection $affiliatePartners;

    /**
     * @param string $name
     * @param string $email
     * @param string|null $contactPerson
     * @param DateTimeInterface $startDate
     * @param DateTimeInterface|null $endDate
     */
    public function __construct(string $name, string $email, ?string $contactPerson, DateTimeInterface $startDate, ?DateTimeInterface $endDate)
    {
        parent::__construct($name, $email);
        $this->contactPerson = $contactPerson;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->solutionPartners = new ArrayCollection();
        $this->solutionProviders = new ArrayCollection();
        $this->affiliatePartners = new ArrayCollection();
        $this->users = new ArrayCollection();
    }

    public function getContactPerson(): ?string
    {
        return $this->contactPerson;
    }

    public function getStartDate(): DateTimeInterface
    {
        return $this->startDate;
    }

    public function getEndDate(): ?DateTimeInterface
    {
        return $this->endDate;
    }

    /**
     * @return Collection<Partner>
     */
    public function getSolutionPartners(): Collection
    {
        return $this->solutionPartners;
    }

    public function getSolutionProviders(): Collection
    {
        return $this->solutionProviders;
    }

    public function getAffiliatePartners(): Collection
    {
        return $this->affiliatePartners;
    }
}

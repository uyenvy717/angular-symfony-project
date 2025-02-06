<?php

namespace App\Entity;

use App\Repository\GeneralPartnerRepository;
use DateTimeInterface;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: GeneralPartnerRepository::class)]
#[ORM\InheritanceType("JOINED")]
#[ORM\DiscriminatorColumn(name: "partner_type", type: "string")]
#[ORM\DiscriminatorMap(
    [
        "solutionPartner" => SolutionPartner::class,
        "solutionProvider" => SolutionProvider::class,
        "affiliatePartner" => AffiliatePartner::class
    ]
)]
class GeneralPartner extends Partner
{
    #[ORM\ManyToOne(targetEntity: GrowthPartner::class)]
    #[ORM\JoinColumn(name: "registered_partner_id", referencedColumnName: "id", nullable: true)]
    private ?GrowthPartner $registeredPartner = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $contactPerson = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private DateTimeInterface $startDate;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?DateTimeInterface $endDate = null;

    #[ORM\Column(nullable: true)]
    private ?int $renewalInterval = null;

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

    public function getRegisteredPartner(): ?GrowthPartner
    {
        return $this->registeredPartner;
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

    public function getRenewalInterval(): ?int
    {
        return $this->renewalInterval;
    }
}

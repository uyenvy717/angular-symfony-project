<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\GrowthPartnerRepository;
use DateTimeInterface;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: GrowthPartnerRepository::class)]
#[ApiResource]
class GrowthPartner extends Partner
{
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $contactPerson = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private DateTimeInterface $startDate;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?DateTimeInterface $endDate = null;

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
}

<?php

namespace App\Traits;

use DateTimeImmutable;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

trait GeneralPartnerTrait
{
    #[Groups(['read', 'post', 'patch'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $contactPerson = null;

    #[Groups(['read', 'post', 'patch'])]
    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    private DateTimeImmutable $startDate;

    #[Groups(['read', 'post', 'patch'])]
    #[ORM\Column(type: Types::DATE_IMMUTABLE, nullable: true)]
    private ?DateTimeImmutable $endDate = null;

    #[Groups(['read', 'post', 'patch'])]
    #[ORM\Column(nullable: true)]
    private ?int $renewalInterval = null;

    public function setContactPerson(?string $contactPerson): void
    {
        $this->contactPerson = $contactPerson;
    }

    public function setStartDate(DateTimeImmutable $startDate): void
    {
        $this->startDate = $startDate;
    }

    public function setEndDate(?DateTimeImmutable $endDate): void
    {
        $this->endDate = $endDate;
    }

    public function setRenewalInterval(?int $renewalInterval): void
    {
        $this->renewalInterval = $renewalInterval;
    }

    public function getContactPerson(): ?string
    {
        return $this->contactPerson;
    }

    public function getStartDate(): DateTimeImmutable
    {
        return $this->startDate;
    }

    public function getEndDate(): ?DateTimeImmutable
    {
        return $this->endDate;
    }

    public function getRenewalInterval(): ?int
    {
        return $this->renewalInterval;
    }
}

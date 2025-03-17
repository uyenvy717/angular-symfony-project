<?php

namespace App\Traits;

use Carbon\Carbon;
use DateTimeImmutable;
use DateTimeInterface;
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
    private DateTimeInterface $startDate;

    #[Groups(['read', 'post', 'patch'])]
    #[ORM\Column(type: Types::DATE_IMMUTABLE, nullable: true)]
    private ?DateTimeInterface $endDate = null;

    #[Groups(['read', 'post', 'patch'])]
    #[ORM\Column(nullable: true)]
    private ?int $renewalInterval = null;

    public function setContactPerson(?string $contactPerson): void
    {
        $this->contactPerson = $contactPerson;
    }

    public function setStartDate(DateTimeInterface $startDate): void
    {
        $this->startDate = $startDate;
    }

    public function setEndDate(?DateTimeInterface $endDate): void
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

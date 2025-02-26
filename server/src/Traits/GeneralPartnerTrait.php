<?php

namespace App\Traits;

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
    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private DateTimeInterface $startDate;

    #[Groups(['read', 'post', 'patch'])]
    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?DateTimeInterface $endDate = null;

    #[Groups(['read', 'post', 'patch'])]
    #[ORM\Column(nullable: true)]
    private ?int $renewalInterval = null;

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

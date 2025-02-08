<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\SolutionPartnerRepository;
use DateTimeInterface;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SolutionPartnerRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['read']],
    denormalizationContext: ['groups' => ['read']],
)]
class SolutionPartner extends GeneralPartner
{
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
        parent::__construct($name, $email, $registeredPartner, $contactPerson, $startDate, $endDate, $renewalInterval);
    }
}

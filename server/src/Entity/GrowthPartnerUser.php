<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\GrowthPartnerUserRepository;
use DateTimeInterface;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: GrowthPartnerUserRepository::class)]
#[ApiResource]
class GrowthPartnerUser extends User
{
    #[ORM\ManyToOne(targetEntity: GrowthPartner::class)]
    #[ORM\JoinColumn(name: "partner_id", referencedColumnName: "id", nullable: true)]
    private ?GrowthPartner $partner = null;

    /**
     * @param string $name
     * @param string $email
     * @param bool $isActive
     * @param DateTimeInterface|null $lastLoggedIn
     * @param GrowthPartner|null $partner
     */
    public function __construct(string $name, string $email, bool $isActive, ?DateTimeInterface $lastLoggedIn, ?GrowthPartner $partner)
    {
        parent::__construct($name, $email, $isActive, $lastLoggedIn);
        $this->partner = $partner;
    }

    public function getPartner(): ?GrowthPartner
    {
        return $this->partner;
    }
}

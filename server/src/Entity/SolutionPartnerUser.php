<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\SolutionPartnerUserRepository;
use DateTimeInterface;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SolutionPartnerUserRepository::class)]
#[ApiResource]
class SolutionPartnerUser extends User
{
    #[ORM\ManyToOne(targetEntity: SolutionPartner::class)]
    #[ORM\JoinColumn(name: "partner_id", referencedColumnName: "id", nullable: true)]
    private ?SolutionPartner $partner = null;

    /**
     * @param string $name
     * @param string $email
     * @param bool $isActive
     * @param DateTimeInterface|null $lastLoggedIn
     * @param SolutionPartner|null $partner
     */
    public function __construct(string $name, string $email, bool $isActive, ?DateTimeInterface $lastLoggedIn, ?SolutionPartner $partner)
    {
        parent::__construct($name, $email, $isActive, $lastLoggedIn);
        $this->partner = $partner;
    }

    public function getPartner(): ?SolutionPartner
    {
        return $this->partner;
    }
}

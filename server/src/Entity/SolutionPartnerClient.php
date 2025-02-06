<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\SolutionPartnerClientRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SolutionPartnerClientRepository::class)]
#[ApiResource]
class SolutionPartnerClient extends Client
{
    #[ORM\ManyToOne(targetEntity: SolutionPartner::class)]
    #[ORM\JoinColumn(name: "registered_partner_id", referencedColumnName: "id", nullable: true)]
    private ?SolutionPartner $registeredPartner = null;

    /**
     * @param string $name
     * @param string $email
     * @param bool $isActive
     * @param SolutionPartner|null $registeredPartner
     */
    public function __construct(string $name, string $email, bool $isActive, ?SolutionPartner $registeredPartner)
    {
        parent::__construct($name, $email, $isActive);
        $this->registeredPartner = $registeredPartner;
    }

    public function getRegisteredPartner(): ?SolutionPartner
    {
        return $this->registeredPartner;
    }
}

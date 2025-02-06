<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\Repository\GrowthPartnerClientRepository;
use App\State\ClientStateProvider;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: GrowthPartnerClientRepository::class)]
#[ApiResource(operations:[
    new GET(
        uriTemplate: '/growth_partners_clients/{id}',
        provider: ClientStateProvider::class
    )
])]
class GrowthPartnerClient extends Client
{
    #[ORM\ManyToOne(targetEntity: GrowthPartner::class)]
    #[ORM\JoinColumn(name: "registered_partner_id", referencedColumnName: "id", nullable: true)]
    private ?GrowthPartner $registeredPartner = null;

    /**
     * @param string $name
     * @param string $email
     * @param bool $isActive
     * @param GrowthPartner|null $registeredPartner
     */
    public function __construct(string $name, string $email, bool $isActive, ?GrowthPartner $registeredPartner)
    {
        parent::__construct($name, $email, $isActive);
        $this->registeredPartner = $registeredPartner;
    }

    public function getRegisteredPartner(): ?GrowthPartner
    {
        return $this->registeredPartner;
    }
}

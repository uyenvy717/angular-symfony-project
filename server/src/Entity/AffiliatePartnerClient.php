<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\AffiliatePartnerClientRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AffiliatePartnerClientRepository::class)]
#[ApiResource]
class AffiliatePartnerClient extends Client
{
    #[ORM\ManyToOne(targetEntity: AffiliatePartner::class)]
    #[ORM\JoinColumn(name: "registered_partner_id", referencedColumnName: "id", nullable: true)]
    private ?AffiliatePartner $registeredPartner = null;

    /**
     * @param string $name
     * @param string $email
     * @param bool $isActive
     * @param AffiliatePartner|null $registeredPartner
     */
    public function __construct(string $name, string $email, bool $isActive, ?AffiliatePartner $registeredPartner)
    {
        parent::__construct($name, $email, $isActive);
        $this->registeredPartner = $registeredPartner;
    }

    public function getRegisteredPartner(): ?AffiliatePartner
    {
        return $this->registeredPartner;
    }
}

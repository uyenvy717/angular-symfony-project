<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\SolutionProviderClientRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SolutionProviderClientRepository::class)]
#[ApiResource]
class SolutionProviderClient extends Client
{
    #[ORM\ManyToOne(targetEntity: SolutionProvider::class)]
    #[ORM\JoinColumn(name: "registered_partner_id", referencedColumnName: "id", nullable: true)]
    private ?SolutionProvider $registeredPartner = null;

    /**
     * @param string $name
     * @param string $email
     * @param bool $isActive
     * @param SolutionProvider|null $registeredPartner
     */
    public function __construct(string $name, string $email, bool $isActive, ?SolutionProvider $registeredPartner)
    {
        parent::__construct($name, $email, $isActive);
        $this->registeredPartner = $registeredPartner;
    }

    public function getRegisteredPartner(): ?SolutionProvider
    {
        return $this->registeredPartner;
    }
}

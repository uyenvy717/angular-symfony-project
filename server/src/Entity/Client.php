<?php

namespace App\Entity;

use App\Repository\ClientRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ClientRepository::class)]
#[ORM\InheritanceType("JOINED")]
#[ORM\DiscriminatorColumn(name: "client_type", type: "string")]
#[ORM\DiscriminatorMap(
    [
        "growthPartnerClient" => GrowthPartnerClient::class,
        "solutionPartnerClient" => SolutionPartnerClient::class,
        "solutionProviderClient" => SolutionProviderClient::class,
        "affiliatePartnerClient" => AffiliatePartnerClient::class
    ]
)]
abstract class Client extends Partner
{
    #[ORM\Column]
    private bool $isActive;

    /**
     * @param string $name
     * @param string $email
     * @param bool $isActive
     */
    public function __construct(string $name, string $email, bool $isActive)
    {
        parent::__construct($name, $email);
        $this->isActive = $isActive;
    }

    public function isActive(): bool
    {
        return $this->isActive;
    }
}

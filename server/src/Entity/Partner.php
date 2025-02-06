<?php

namespace App\Entity;

use App\Interface\IDable;
use App\Repository\PartnerRepository;
use App\Traits\IDScheme;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PartnerRepository::class)]
#[ORM\InheritanceType("JOINED")]
#[ORM\DiscriminatorColumn(name: "partner_type", type: "string")]
#[ORM\DiscriminatorMap(
    [
        "growth" => GrowthPartner::class,
        "generalPartner" => GeneralPartner::class
    ]
)]
abstract class Partner implements IDable
{
    use IDScheme;

    #[ORM\Column(length: 255)]
    private string $name;

    #[ORM\Column(length: 255)]
    private string $email;

    /**
     * @param string $name
     * @param string $email
     */
    public function __construct(string $name, string $email)
    {
        $this->name = $name;
        $this->email = $email;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getEmail(): string
    {
        return $this->email;
    }
}

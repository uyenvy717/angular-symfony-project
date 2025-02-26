<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Interface\IDable;
use App\Repository\PartnerRepository;
use App\Traits\IDScheme;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: PartnerRepository::class)]
#[ORM\InheritanceType("JOINED")]
#[ORM\DiscriminatorColumn(name: "partner_type", type: "string")]
#[ORM\DiscriminatorMap(
    [
        "growth_partners" => GrowthPartner::class,
        "solution_partners" => SolutionPartner::class,
        "solution_providers" => SolutionProvider::class,
        "affiliate_partners" => AffiliatePartner::class
    ]
)]
#[ApiResource]
abstract class Partner implements IDable
{
    use IDScheme;

    #[Groups(['read', 'post', 'patch'])]
    #[ORM\Column(length: 255)]
    private string $name;

    #[Groups(['read', 'post'])]
    #[ORM\Column(length: 255)]
    private string $email;

    #[ORM\OneToMany(targetEntity: Client::class, mappedBy: "partner")]
    private Collection $clients;

    #[ORM\OneToMany(targetEntity: User::class, mappedBy: "partner")]
    private Collection $users;

    /**
     * @param string $name
     * @param string $email
     */
    public function __construct(string $name, string $email)
    {
        $this->name = $name;
        $this->email = $email;
        $this->clients = new ArrayCollection();
        $this->users = new ArrayCollection();
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function setEmail(string $email): void
    {
        $this->email = $email;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    #[Groups(['read'])]
    public function getClients(): array
    {
        return $this->clients->toArray();
    }

    #[Groups(['read'])]
    public function getUsers(): array
    {
        return $this->users->toArray();
    }
}

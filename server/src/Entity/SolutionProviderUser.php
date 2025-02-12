<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\SolutionProviderUserRepository;
use DateTimeInterface;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SolutionProviderUserRepository::class)]
#[ApiResource]
class SolutionProviderUser extends User
{
    #[ORM\ManyToOne(targetEntity: SolutionProvider::class)]
    #[ORM\JoinColumn(name: "partner_id", referencedColumnName: "id", nullable: true)]
    private ?SolutionProvider $partner = null;

    /**
     * @param string $name
     * @param string $email
     * @param bool $isActive
     * @param DateTimeInterface|null $lastLoggedIn
     * @param SolutionProvider|null $partner
     */
    public function __construct(string $name, string $email, bool $isActive, ?DateTimeInterface $lastLoggedIn, ?SolutionProvider $partner)
    {
        parent::__construct($name, $email, $isActive, $lastLoggedIn);
        $this->partner = $partner;
    }

    public function getPartner(): ?SolutionProvider
    {
        return $this->partner;
    }
}

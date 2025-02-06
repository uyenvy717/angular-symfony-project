<?php

namespace App\Entity;

use App\Repository\UserRepository;
use DateTimeInterface;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: "portal_user")]
#[ORM\InheritanceType("JOINED")]
#[ORM\DiscriminatorColumn(name: "user_type", type: "string")]
#[ORM\DiscriminatorMap(
    [
        "growthPartnerUser" => GrowthPartnerUser::class,
        "solutionPartnerUser" => SolutionPartnerUser::class,
        "solutionProviderUser" => SolutionProviderUser::class
    ]
)]
abstract class User extends Partner
{
    #[ORM\Column]
    private bool $isActive;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?DateTimeInterface $lastLoggedIn = null;

    /**
     * @param string $name
     * @param string $email
     * @param bool $isActive
     * @param ?DateTimeInterface|null $lastLoggedIn
     */
    public function __construct(string $name, string $email, bool $isActive, ?DateTimeInterface $lastLoggedIn)
    {
        parent::__construct($name, $email);
        $this->isActive = $isActive;
        $this->lastLoggedIn = $lastLoggedIn;
    }

    public function isActive(): bool
    {
        return $this->isActive;
    }

    public function getLastLoggedIn(): ?DateTimeInterface
    {
        return $this->lastLoggedIn;
    }
}

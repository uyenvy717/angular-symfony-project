<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\SolutionPartnerRepository;
use App\Traits\GeneralPartnerTrait;
use DateTimeInterface;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: SolutionPartnerRepository::class)]
#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(),
        new Post(
            denormalizationContext: ['groups' => ['post']]
        ),
        new Patch(
            denormalizationContext: ['groups' => ['patch']]
        ),
        new Delete()
    ],
    normalizationContext: ['groups' => ['read']]
)]
class SolutionPartner extends Partner
{
    use GeneralPartnerTrait;

    #[ORM\ManyToOne(targetEntity: GrowthPartner::class, inversedBy: "solutionPartners")]
    #[ORM\JoinColumn(nullable: true)]
    #[ApiProperty(readableLink: false, writableLink: false)]
    private ?GrowthPartner $registeredPartner;

    /**
     * @param string $name
     * @param string $email
     * @param GrowthPartner|null $registeredPartner
     * @param string|null $contactPerson
     * @param DateTimeInterface $startDate
     * @param DateTimeInterface|null $endDate
     * @param int|null $renewalInterval
     */
    public function __construct(
        string $name,
        string $email,
        ?GrowthPartner $registeredPartner,
        ?string $contactPerson,
        DateTimeInterface $startDate,
        ?DateTimeInterface $endDate,
        ?int $renewalInterval
    )
    {
        parent::__construct($name, $email);
        $this->registeredPartner = $registeredPartner;
        $this->contactPerson = $contactPerson;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->renewalInterval = $renewalInterval;
    }

    #[Groups(['post', 'patch'])]
    public function setRegisteredPartner(?GrowthPartner $partner): void
    {
        $this->registeredPartner = $partner;
    }

    #[Groups(['read'])]
    public function getRegisteredPartnerId(): ?string
    {
        return $this->registeredPartner?->getId()->toString();
    }
}

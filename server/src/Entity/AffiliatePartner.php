<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Link;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\AffiliatePartnerRepository;
use App\Traits\GeneralPartnerTrait;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: AffiliatePartnerRepository::class)]
#[ApiResource(
    operations: [
        new Get(
            security: "is_granted('ROLE_SUPER_ADMIN') or object.getRegisteredPartner() == user.getPartner()"
        ),
        new GetCollection(
            provider: 'App\State\PartnerProvider.Affiliate'
        ),
        new GetCollection(
            uriTemplate: '/affiliate_partners/by_registered_partner/{registeredPartnerId}',
            uriVariables: [
                'registeredPartnerId' => new Link(
                    fromProperty: 'affiliatePartners',
                    fromClass: GrowthPartner::class,
                    identifiers: ['id']
                )
            ],
            name: 'get_affiliate_partners_by_registered_partner',
            provider: 'App\State\PartnerProvider.Affiliate'
        ),
        new Post(
            denormalizationContext: ['groups' => ['post']],
            securityPostDenormalize: "is_granted('ROLE_SUPER_ADMIN') or object.getRegisteredPartner() == user.getPartner() or object.getRegisteredPartner() == null"
        ),
        new Patch(
            denormalizationContext: ['groups' => ['patch']],
            security: "is_granted('ROLE_SUPER_ADMIN')
                or object.getRegisteredPartner() == user.getPartner() or object.getRegisteredPartner() == null",
            securityPostDenormalize: "is_granted('ROLE_SUPER_ADMIN')
                or object.getRegisteredPartner() == user.getPartner() or object.getRegisteredPartner() == null"
        )
    ],
    normalizationContext: ['groups' => ['read']]
)]
class AffiliatePartner extends Partner
{
    use GeneralPartnerTrait;

    #[ORM\ManyToOne(targetEntity: GrowthPartner::class, inversedBy: "affiliatePartners")]
    #[ORM\JoinColumn(nullable: true)]
    #[ApiProperty(readableLink: false, writableLink: false)]
    private ?GrowthPartner $registeredPartner;

    /**
     * @param string $name
     * @param string $email
     * @param GrowthPartner|null $registeredPartner
     * @param string|null $contactPerson
     * @param DateTimeImmutable $startDate
     * @param DateTimeImmutable|null $endDate
     * @param int|null $renewalInterval
     */
    public function __construct(
        string $name,
        string $email,
        ?GrowthPartner $registeredPartner,
        ?string $contactPerson,
        DateTimeImmutable $startDate,
        ?DateTimeImmutable $endDate,
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

    #[Groups(['client:read'])]
    public function getRegisteredPartner(): ?GrowthPartner
    {
        return $this->registeredPartner;
    }

    #[Groups(['read'])]
    public function getRegisteredPartnerId(): ?string
    {
        return $this->registeredPartner?->getId()->toString();
    }

    #[Groups(['client:read'])]
    public function getRegisteredPartnerName(): ?string
    {
        return $this->registeredPartner?->getName();
    }
}

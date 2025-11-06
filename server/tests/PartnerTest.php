<?php

namespace App\Tests;

use App\Entity\AffiliatePartner;
use App\Entity\GrowthPartner;
use App\Entity\SolutionPartner;
use App\Entity\SolutionProvider;
use App\Repository\GrowthPartnerRepository;
use App\Repository\PartnerRepository;
use Carbon\CarbonImmutable;

class PartnerTest extends AbstractTest
{
    private array $body = [
        'email' => 'admin@user',
        'password' => 'testpassword',
    ];

    // Partners cannot retrieve the growth partner
    public function testGetGrowthPartner()
    {
        // Other partners cannot retrieve growth partners
        $this->createClientWithCredentials()->request('GET', '/api/growth_partners');
        $this->assertResponseStatusCodeSame(403);
    }

    // Only top-level account can get growth partners
    public function testGetGrowthPartners()
    {
        $this->createClientWithCredentials(null, $this->body)->request('GET', '/api/growth_partners');

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);

        $this->assertJsonContains([
            '@context' => '/api/contexts/GrowthPartner',
            '@id' => '/api/growth_partners',
            '@type' => 'Collection',
            'totalItems' => 2
        ]);

        $this->assertMatchesResourceItemJsonSchema(GrowthPartner::class);
    }

    // Only top-level
    public function testCreateGrowthPartner()
    {
        $payload = [
            'contactPerson' => null,
            'startDate' => CarbonImmutable::now(),
            'endDate' => null,
            'name' => 'growthPartner',
            'email' => 'growth@partner.com',
        ];

        $this->createClientWithCredentials(null, $this->body)->request('POST', '/api/growth_partners', [
            'headers' => ['Content-Type' => 'application/ld+json; charset=utf-8'],
            'json' => $payload,
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(201);
        $this->assertMatchesResourceItemJsonSchema(GrowthPartner::class);
    }

    // Only top-level
    public function testUpdateGrowthPartner()
    {
        $payload = [
            'contactPerson' => 'testUpdate',
            'email' => 'testUpdate@partner.com',
        ];

        $partnerRepository = static::getContainer()->get(PartnerRepository::class);
        $growthPartner = $partnerRepository->findOneBy(['name' => 'Mochadocs']);
        $growthPartnerId = $growthPartner->getId();

        $response = $this->createClientWithCredentials(null, $this->body)->request('PATCH', '/api/growth_partners/'.$growthPartnerId, [
            'headers' => ['Content-Type' => 'application/merge-patch+json; charset=utf-8'],
            'json' => $payload,
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);

        // Check the email
        $content = json_decode($response->getContent(), true);
        $this->assertArrayHasKey('email', $content);
        $this->assertEquals(
            $growthPartner->getEmail(),
            $content['email'],
            "The email should not be updated"
        );
    }

    // Growth partner get solution partners in the scope
    public function testGetSolutionPartner()
    {
        $this->createClientWithCredentials()->request('GET', '/api/solution_partners');
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);

        $this->assertJsonContains([
            '@context' => '/api/contexts/SolutionPartner',
            '@id' => '/api/solution_partners',
            '@type' => 'Collection',
            'totalItems' => 1
        ]);

        $this->assertMatchesResourceItemJsonSchema(SolutionPartner::class);
    }

    // Top-level account can get all solution partners
    public function testGetAllSolutionPartners()
    {
        $this->createClientWithCredentials(null, $this->body)->request('GET', '/api/solution_partners');
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);

        $this->assertJsonContains([
            '@context' => '/api/contexts/SolutionPartner',
            '@id' => '/api/solution_partners',
            '@type' => 'Collection',
            'totalItems' => 2
        ]);

        $this->assertMatchesResourceItemJsonSchema(SolutionPartner::class);
    }

    // Growth partner can create a solution partner in scope
    public function testCreateSolutionPartner()
    {
        $payload = [
            'registeredPartner' => null,
            'contactPerson' => null,
            'startDate' => CarbonImmutable::now(),
            'endDate' => null,
            'renewalInterval' => null,
            'name' => 'solutionPartnerTest',
            'email' => 'solution@partner.com',
        ];

         $this->createClientWithCredentials()->request('POST', '/api/solution_partners', [
            'headers' => ['Content-Type' => 'application/ld+json; charset=utf-8'],
            'json' => $payload,
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(201);
        $this->assertMatchesResourceItemJsonSchema(SolutionPartner::class);

        // Cannot create a solution partner out of the scope
        $growthPartnerRepository = $this->getContainer()->get(GrowthPartnerRepository::class);
        $growthPartnerId = $growthPartnerRepository->findOneBy(['name' => 'Nordics/Baltics'])->getId();

        $payload = [
            'registeredPartner' => '/api/growth_partners/'.$growthPartnerId,
            'contactPerson' => null,
            'startDate' => CarbonImmutable::now(),
            'endDate' => null,
            'renewalInterval' => null,
            'name' => 'solutionPartnerTest',
            'email' => 'solution@partner.com',
        ];

        $this->createClientWithCredentials()->request('POST', '/api/solution_partners', [
            'headers' => ['Content-Type' => 'application/ld+json; charset=utf-8'],
            'json' => $payload,
        ]);

        $this->assertResponseStatusCodeSame(403);
    }

    // Top-level account can create a solution partner under any growth partner
    public function testCreateAnySolutionPartner()
    {
        $growthPartnerRepository = $this->getContainer()->get(GrowthPartnerRepository::class);
        $growthPartnerId = $growthPartnerRepository->findOneBy(['name' => 'Nordics/Baltics'])->getId();

        $payload = [
            'registeredPartner' => '/api/growth_partners/'.$growthPartnerId,
            'contactPerson' => null,
            'startDate' => CarbonImmutable::now(),
            'endDate' => null,
            'renewalInterval' => null,
            'name' => 'solutionPartnerTest',
            'email' => 'solution@partner.com',
        ];

        $this->createClientWithCredentials(null, $this->body)->request('POST', '/api/solution_partners', [
            'headers' => ['Content-Type' => 'application/ld+json; charset=utf-8'],
            'json' => $payload,
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(201);
        $this->assertMatchesResourceItemJsonSchema(SolutionPartner::class);
    }

    // Growth partner can update solution partner's information in scope
    public function testUpdateSolutionPartner()
    {
        $partnerRepository = $this->getContainer()->get(PartnerRepository::class);
        $solutionPartner = $partnerRepository->findOneBy(['name' => 'SolutionPartner']);

        $payload = [
            'contactPerson' => 'testPerson',
            'email' => 'testUpdate@partner.com'
        ];

        $response = $this->createClientWithCredentials()->request('PATCH', '/api/solution_partners/'.$solutionPartner->getId(), [
            'headers' => ['Content-Type' => 'application/merge-patch+json; charset=utf-8'],
            'json' => $payload,
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);

        $content = json_decode($response->getContent(), true);
        $this->assertArrayHasKey('email', $content);

        $this->assertEquals(
            $solutionPartner->getEmail(),
            $content['email'],
            "The email should not be updated"
        );

        // Cannot assign the solution partner to other growth partner
        $growthPartnerId = $partnerRepository->findOneBy(['name' => 'Nordics/Baltics'])->getId();
        $payload = [
            'registeredPartner' => '/api/growth_partners/'.$growthPartnerId
        ];

        $this->createClientWithCredentials()->request('PATCH', '/api/solution_partners/'.$solutionPartner->getId(), [
            'headers' => ['Content-Type' => 'application/merge-patch+json; charset=utf-8'],
            'json' => $payload,
        ]);

        $this->assertResponseStatusCodeSame(403);
    }

    // Growth partner can get the solution provider in scope
    public function testGetSolutionProvider()
    {
        $partnerRepository = $this->getContainer()->get(PartnerRepository::class);
        $partnerId = $partnerRepository->findOneBy(['name' => 'SolutionProvider'])->getId();

        $this->createClientWithCredentials()->request('GET', '/api/solution_providers/'.$partnerId);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);
        $this->assertMatchesResourceItemJsonSchema(SolutionProvider::class);
    }

    // Growth partner can create and update a solution provider in scope
    public function testCreateUpdateSolutionProvider()
    {
        // Create a new solution provider
        $payload = [
            'registeredPartner' => null,
            'contactPerson' => null,
            'startDate' => CarbonImmutable::now(),
            'endDate' => null,
            'renewalInterval' => null,
            'name' => 'solutionProviderTest',
            'email' => 'solution@provider.com',
        ];

        $this->createClientWithCredentials()->request('POST', '/api/solution_providers', [
            'headers' => ['Content-Type' => 'application/ld+json; charset=utf-8'],
            'json' => $payload,
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(201);
        $this->assertMatchesResourceItemJsonSchema(SolutionProvider::class);

        // Update the solution provider
        $partnerRepository = $this->getContainer()->get(PartnerRepository::class);
        $solutionProviderId = $partnerRepository->findOneBy(['name' => 'solutionProviderTest'])->getId();
        $growthPartnerId = $partnerRepository->findOneBy(['name' => 'Mochadocs'])->getId();

        $payload = [
            'registeredPartner' => '/api/growth_partners/'.$growthPartnerId,
        ];

        $this->createClientWithCredentials()->request('PATCH', '/api/solution_providers/'.$solutionProviderId, [
            'headers' => ['Content-Type' => 'application/merge-patch+json; charset=utf-8'],
            'json' => $payload,
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);
        $this->assertMatchesResourceItemJsonSchema(SolutionProvider::class);
    }

    // Growth partner cannot get the affiliate partner out of scope
    public function testGetAffiliatePartner()
    {
        $partnerRepository = $this->getContainer()->get(PartnerRepository::class);
        $partnerId = $partnerRepository->findOneBy(['name' => 'AffiliatePartner'])->getId();

        $this->createClientWithCredentials()->request('GET', '/api/affiliate_partners/'.$partnerId);

        $this->assertResponseStatusCodeSame(403);
    }

    // Growth partner can create and update an affiliate partner in scope
    public function testCreateAffiliatePartner()
    {
        // Create a new affiliate partner
        $payload = [
            'registeredPartner' => null,
            'contactPerson' => null,
            'startDate' => CarbonImmutable::now(),
            'endDate' => null,
            'renewalInterval' => null,
            'name' => 'affiliatePartnerTest',
            'email' => 'affiliate@partner.com',
        ];

        $this->createClientWithCredentials()->request('POST', '/api/affiliate_partners', [
            'headers' => ['Content-Type' => 'application/ld+json; charset=utf-8'],
            'json' => $payload,
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(201);

        // Update the affiliate partner
        $partnerRepository = $this->getContainer()->get(PartnerRepository::class);
        $affiliatePartnerId = $partnerRepository->findOneBy(['name' => 'affiliatePartnerTest'])->getId();
        $growthPartnerId = $partnerRepository->findOneBy(['name' => 'Mochadocs'])->getId();

        $payload = [
            'registeredPartner' => '/api/growth_partners/'.$growthPartnerId,
        ];

        $this->createClientWithCredentials()->request('PATCH', '/api/affiliate_partners/'.$affiliatePartnerId, [
            'headers' => ['Content-Type' => 'application/merge-patch+json; charset=utf-8'],
            'json' => $payload,
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);
        $this->assertMatchesResourceItemJsonSchema(AffiliatePartner::class);
    }
}
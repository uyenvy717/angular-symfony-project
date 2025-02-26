<?php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\DataFixtures\AppFixtures;
use App\Entity\AffiliatePartner;
use App\Entity\GrowthPartner;
use App\Entity\SolutionPartner;
use App\Entity\SolutionProvider;
use App\Repository\PartnerRepository;
use Carbon\Carbon;
use Doctrine\Common\DataFixtures\Purger\ORMPurger;
use Doctrine\ORM\EntityManagerInterface;

class PartnerTest extends APITestCase
{
    protected function setUp(): void
    {
        self::bootKernel();
        $container = static::getContainer();
        $entityManager = $container->get(EntityManagerInterface::class);

        $purger = new ORMPurger($entityManager);
        $purger->purge();

        // Load fixtures
        $fixtureLoader = $container->get(AppFixtures::class);
        $fixtureLoader->load($entityManager);
        $entityManager->flush();
    }

    public function testGetGrowthPartner()
    {
        $client = static::createClient();

        $client->request('GET', '/api/growth_partners');
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

    public function testCreateGrowthPartner()
    {
        $client = static::createClient();
        $payload = [
            'contactPerson' => null,
            'startDate' => Carbon::now(),
            'endDate' => null,
            'name' => 'growthPartner',
            'email' => 'growth@partner.com',
        ];

        $client->request('POST', '/api/growth_partners', [
            'headers' => ['Content-Type' => 'application/ld+json; charset=utf-8'],
            'json' => $payload,
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(201);
    }

    public function testUpdateGrowthPartner()
    {
        $client = static::createClient();
        $payload = [
            'contactPerson' => 'testUpdate',
            'email' => 'testUpdate@partner.com',
        ];

        $partnerRepository = static::getContainer()->get(PartnerRepository::class);
        $growthPartner = $partnerRepository->findOneBy(['name' => 'growth']);
        $growthPartnerId = $growthPartner->getId();

        $response = $client->request('PATCH', '/api/growth_partners/'.$growthPartnerId, [
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

    public function testGetSolutionPartner()
    {
        $client = static::createClient();

        $client->request('GET', '/api/solution_partners');
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

    public function testCreateSolutionPartner()
    {
        $client = static::createClient();
        $payload = [
            'registeredPartner' => null,
            'contactPerson' => null,
            'startDate' => Carbon::now(),
            'endDate' => null,
            'renewalInterval' => null,
            'name' => 'solutionPartnerTest',
            'email' => 'solution@partner.com',
        ];

         $client->request('POST', '/api/solution_partners', [
            'headers' => ['Content-Type' => 'application/ld+json; charset=utf-8'],
            'json' => $payload,
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(201);
    }

    public function testUpdateSolutionPartner()
    {
        $client = static::createClient();

        $partnerRepository = static::getContainer()->get(PartnerRepository::class);
        $growthPartnerId = $partnerRepository->findOneBy(['name' => 'growth2'])->getId();
        $solutionPartner = $partnerRepository->findOneBy(['name' => 'solutionPartner']);

        $payload = [
            'registeredPartner' => '/api/growth_partners/'.$growthPartnerId,
            'email' => 'testUpdate@partner.com',
        ];

        $response = $client->request('PATCH', '/api/solution_partners/'.$solutionPartner->getId(), [
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
    }

    public function testGetSolutionProvider()
    {
        $client = static::createClient();

        $partnerRepository = $this->getContainer()->get(PartnerRepository::class);
        $partnerId = $partnerRepository->findOneBy(['name' => 'solutionProvider'])->getId();

        $client->request('GET', '/api/solution_providers/'.$partnerId);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);
        $this->assertMatchesResourceItemJsonSchema(SolutionProvider::class);
    }

    public function testCreateSolutionProvider()
    {
        $client = static::createClient();
        $payload = [
            'registeredPartner' => null,
            'contactPerson' => null,
            'startDate' => Carbon::now(),
            'endDate' => null,
            'renewalInterval' => null,
            'name' => 'solutionProviderTest',
            'email' => 'solution@provider.com',
        ];

        $client->request('POST', '/api/solution_providers', [
            'headers' => ['Content-Type' => 'application/ld+json; charset=utf-8'],
            'json' => $payload,
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(201);
    }

    public function testUpdateSolutionProvider()
    {
        $client = static::createClient();
        $partnerRepository = static::getContainer()->get(PartnerRepository::class);
        $solutionProviderId = $partnerRepository->findOneBy(['name' => 'solutionProvider'])->getId();

        $payload = [
            'endDate' => Carbon::tomorrow(),
            'renewalInterval' => null,
        ];

        $client->request('PATCH', '/api/solution_providers/'.$solutionProviderId, [
            'headers' => ['Content-Type' => 'application/merge-patch+json; charset=utf-8'],
            'json' => $payload,
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);
        $this->assertMatchesResourceItemJsonSchema(SolutionProvider::class);
    }

    public function testGetAffiliatePartner()
    {
        $client = static::createClient();

        $partnerRepository = $this->getContainer()->get(PartnerRepository::class);
        $partnerId = $partnerRepository->findOneBy(['name' => 'affiliatePartner'])->getId();

        $client->request('GET', '/api/affiliate_partners/'.$partnerId);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);
        $this->assertMatchesResourceItemJsonSchema(AffiliatePartner::class);
    }

    public function testCreateAffiliatePartner()
    {
        $client = static::createClient();
        $payload = [
            'registeredPartner' => null,
            'contactPerson' => null,
            'startDate' => Carbon::now(),
            'endDate' => null,
            'renewalInterval' => null,
            'name' => 'affiliatePartnerTest',
            'email' => 'affiliate@partner.com',
        ];

        $client->request('POST', '/api/affiliate_partners', [
            'headers' => ['Content-Type' => 'application/ld+json; charset=utf-8'],
            'json' => $payload,
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(201);
    }

    public function testUpdateAffiliatePartner()
    {
        $client = static::createClient();
        $partnerRepository = static::getContainer()->get(PartnerRepository::class);
        $affiliatePartnerId = $partnerRepository->findOneBy(['name' => 'affiliatePartner'])->getId();

        $payload = [
            'startDate' => Carbon::now(),
        ];

        $client->request('PATCH', '/api/affiliate_partners/'.$affiliatePartnerId, [
            'headers' => ['Content-Type' => 'application/merge-patch+json; charset=utf-8'],
            'json' => $payload,
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);
        $this->assertMatchesResourceItemJsonSchema(AffiliatePartner::class);
    }
}
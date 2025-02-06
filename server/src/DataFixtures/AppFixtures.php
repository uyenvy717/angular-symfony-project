<?php

namespace App\DataFixtures;

use App\Entity\AffiliatePartner;
use App\Entity\AffiliatePartnerClient;
use App\Entity\GrowthPartner;
use App\Entity\GeneralPartner;
use App\Entity\GrowthPartnerClient;
use App\Entity\GrowthPartnerUser;
use App\Entity\SolutionPartner;
use App\Entity\SolutionPartnerClient;
use App\Entity\SolutionPartnerUser;
use App\Entity\SolutionProvider;
use App\Entity\SolutionProviderClient;
use App\Entity\SolutionProviderUser;
use Carbon\Carbon;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $growthPartner = new GrowthPartner("growth", "abc@123", null, Carbon::now(), null);
        $manager->persist($growthPartner);
        $growthPartner2 = new GrowthPartner("growth2", "abc@456", null, Carbon::now(), null);
        $manager->persist($growthPartner2);

        $solutionPartner = new SolutionPartner("solutionPartner", "solution@partner", $growthPartner, null, Carbon::now(), null, null);
        $manager->persist($solutionPartner);
        $solutionProvider = new SolutionProvider("solutionProvider", "solution@provider", $growthPartner, null, Carbon::now(), null, null);
        $manager->persist($solutionProvider);
        $affiliatePartner = new AffiliatePartner("affiliatePartner", "affiliate@partner", $growthPartner2, null, Carbon::now(), null, null);
        $manager->persist($affiliatePartner);

        $client = new GrowthPartnerClient("gpClient", "gp@client", true, $growthPartner2);
        $manager->persist($client);
        $client2 = new SolutionPartnerClient("spaClient", "spa@client", true, $solutionPartner);
        $manager->persist($client2);
        $client3 = new SolutionProviderClient("sprClient", "spr@client", true, $solutionProvider);
        $manager->persist($client3);
        $client4 = new AffiliatePartnerClient("aClient", "a@client", true, $affiliatePartner);
        $manager->persist($client4);

        $user = new GrowthPartnerUser("gpUser", "gp@user", true, null, $growthPartner);
        $manager->persist($user);
        $user2 = new SolutionPartnerUser("spaUser", "spa@user", true, Carbon::now(), $solutionPartner);
        $manager->persist($user2);
        $user3 = new SolutionProviderUser("sprUser", "spr@user", true, Carbon::now(), $solutionProvider);
        $manager->persist($user3);

        $manager->flush();
    }
}

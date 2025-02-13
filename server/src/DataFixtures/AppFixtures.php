<?php

namespace App\DataFixtures;

use App\Entity\AffiliatePartner;
use App\Entity\Client;
use App\Entity\GrowthPartner;
use App\Entity\GrowthPartnerUser;
use App\Entity\SolutionPartner;
use App\Entity\SolutionPartnerUser;
use App\Entity\SolutionProvider;
use App\Entity\SolutionProviderUser;
use App\Entity\User;
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
        $solutionPartner2 = new SolutionPartner("solutionPartner2", "solution2@partner", $growthPartner2, null, Carbon::now(), null, null);
        $manager->persist($solutionPartner2);
        $solutionProvider = new SolutionProvider("solutionProvider", "solution@provider", $growthPartner, null, Carbon::now(), null, null);
        $manager->persist($solutionProvider);
        $affiliatePartner = new AffiliatePartner("affiliatePartner", "affiliate@partner", $growthPartner2, null, Carbon::now(), null, null);
        $manager->persist($affiliatePartner);

        $client = new Client("gpClient", "gp@client", true, $growthPartner2, Carbon::now());
        $manager->persist($client);
        $client2 = new Client("spaClient", "spa@client", true, $solutionPartner, Carbon::now());
        $manager->persist($client2);
        $client3 = new Client("sprClient", "spr@client", true, $solutionProvider, Carbon::now());
        $manager->persist($client3);
        $client4 = new Client("aClient", "a@client", true, $affiliatePartner, Carbon::now());
        $manager->persist($client4);
        $client5 = new Client("spaClient2", "spa2@client", true, $solutionPartner2, Carbon::now());
        $manager->persist($client5);
        $client6 = new Client("spaClient3", "spa3@client", true, $solutionPartner2, Carbon::now());
        $manager->persist($client6);

        $user = new User("gpUser", "gp@user", true, null, $growthPartner);
        $manager->persist($user);
        $user2 = new User("spaUser", "spa@user", true, Carbon::now(), $solutionPartner);
        $manager->persist($user2);
        $user3 = new User("sprUser", "spr@user", true, Carbon::now(), $solutionProvider);
        $manager->persist($user3);

        $manager->flush();
    }
}

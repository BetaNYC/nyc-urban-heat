import { useState } from "react";
import Nav from "../components/Nav";
import Banner from "../components/Banner";
import ResourceDefinitionCard from "../components/ResourceDefinitionCard";
import ResourceCard from "../components/ResourceCard";
import AdvocacyGroupsCard from "../components/AdvocacyGroupsCard";

const ResourcesPage = () => {
  const tags = [
    "Understanding the NYC Urban Heat Data Portal",
    "NYC Extreme Heat Resources",
    "Directory of Urban Heat Advocacy Groups",
  ];

  const [clickedIndex, setClickedIndex] = useState<string>(tags[0]);

  return (
    <div className="w-full">
      <Nav />
      <Banner
        title="Resources"
        tags={tags}
        clickedIndex={clickedIndex}
        setClickedIndex={setClickedIndex}
      />
      {clickedIndex === "Understanding the NYC Urban Heat Data Portal" &&
        (<div className="flex justify-center">
          <div className="px-5 py-[5rem] container">
            <div className="mb-20">
              <h1 className="font-semibold text-headline">Terms and Definitions</h1>
              <p className="font-regular text-regular max-w-[36rem]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, eligendi similique
                inventore eos animi molestiae ut sapiente, consectetur repellat, quis a. Tempore
                doloremque, asperiores accusamus natus eum corrupti reiciendis rerum.
              </p>
            </div>
            <div className="flex flex-col gap-[4.5rem]">
              <ResourceDefinitionCard title="Outdoor Heat Exposure Index" />
              <ResourceDefinitionCard title="Mean Radiant Temperature (MRT)" />
              <ResourceDefinitionCard title="Surface Temperature" />
              <ResourceDefinitionCard title="Tree Canopies" />
              <ResourceDefinitionCard title="Cool Roofs" />
              <ResourceDefinitionCard title="Permeable Surfaces" />
              <ResourceDefinitionCard title="Air Temperature" />
              <ResourceDefinitionCard title="Air Heat Index" />
              <ResourceDefinitionCard title="Weather Station" />
            </div>
          </div>
        </div>)
      }
      {
        clickedIndex === "NYC Extreme Heat Resources" &&
        <div className="flex justify-center">
          <div className="px-5 py-[5rem] container">
            <div className="mb-20">
              <h1 className="font-semibold text-headline">NYC Extreme Heat Resources</h1>
              <p className="font-regular text-regular max-w-[36rem]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, eligendi similique
                inventore eos animi molestiae ut sapiente, consectetur repellat, quis a. Tempore
                doloremque, asperiores accusamus natus eum corrupti reiciendis rerum.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ResourceCard title="Find a cool place 24/7" cta="Find NYC Cool Options"/>
              <ResourceCard title="Cool It! NYC map" cta="Go to Cool It! NYC map"/>
              <ResourceCard title="Heat emergency plan guideline" cta="Go to Beat the Heat! website"/>
              <ResourceCard title="Prepare for Extreme Heat" cta="NYC Health Resources"/>
              <ResourceCard title="Look up your neighborhood's heat vulnerability" cta="Heat Vulnerability Index Website"/>
            </div>

          </div>
        </div>
      }
      {
        clickedIndex === "Directory of Urban Heat Advocacy Groups" &&
        <div className="flex justify-center">
          <div className="px-5 py-[5rem] container">
            <div className="mb-20">
              <h1 className="font-semibold text-headline">Directory of Urban Heat Advocacy Groups</h1>
              <p className="font-regular text-regular max-w-[36rem]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, eligendi similique
                inventore eos animi molestiae ut sapiente, consectetur repellat, quis a. Tempore
                doloremque, asperiores accusamus natus eum corrupti reiciendis rerum.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AdvocacyGroupsCard title="East New York Community Land Trust" content="A grassroots, people of color-led non-profit organization aiming to protect, stabilize, and expand the stock of affordable homes, locally-owned small businesses, and green spaces in East New York and Brownsville" />
              <AdvocacyGroupsCard title="El Puente" content="El Puente combines art, youth development, and community building to drive social justice initiatives, empowering future leaders and advocating for equitable communities." />
              <AdvocacyGroupsCard title="Mayor’s Office of Climate & Environmental Justice" content="MOCEJ works to create a sustainable NYC by making buildings efficient, infrastructure climate-ready, and energy clean, while transforming streets into vibrant public spaces." />
              <AdvocacyGroupsCard title="Natural Resources Defense Council" content="NRDC ensures the rights of all people to clean air, clean water, and healthy communities." />
              <AdvocacyGroupsCard title="Neighbors for a Greener Harlem" content="Supporting sustainable practices to improve our quality of life and foster a more inclusive neighborhood." />
              <AdvocacyGroupsCard title="New York City Environmental Justice Alliance" content="a citywide network of grassroots organizations from low-income neighborhoods and communities of color, fighting for environmental justice since 1991" />
              <AdvocacyGroupsCard title="South Bronx Unite" content="Improve and protect the social, environmental, and economic future of Mott Haven and Port Morris" />
              <AdvocacyGroupsCard title="WeAct" content="Build healthy communities by ensuring that people of color and/or low income residents participate meaningfully in the creation of sound and fair environmental health and protection policies and practicesＦ" />
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default ResourcesPage;

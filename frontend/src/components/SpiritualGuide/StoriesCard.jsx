import story1 from "../../assets/SpiritualGuide/dailyHub/story-1.png";
import story2 from "../../assets/SpiritualGuide/dailyHub/story-2.png";
import story3 from "../../assets/SpiritualGuide/dailyHub/story-3.png";
import story4 from "../../assets/SpiritualGuide/dailyHub/story-4.png";
import RamayanaPDF from "../../assets/SpiritualGuide/dailyHub/Ramayana_Story.pdf";
import { stories } from "../../data/SpiritualGuide/dailyHubData";

import { BookOpen } from "lucide-react";

export default function StoriesCard({
  onRead,
}) {

  const storyImages = {
    story1,
    story2,
    story3,
    story4,
  };

  return (

    <div className="rounded-3xl border border-orange-100 bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">


      {/* Header */}

      <div className="mb-3 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-orange-100 p-3 text-orange-600">

            <BookOpen size={20} />

          </div>

          <div>

            <h3 className="font-bold text-orange-600">

              Inspiring Stories

            </h3>

            <p className="text-sm text-slate-500">

              Learn from Ramayana

            </p>

          </div>

        </div>

        <button onClick={() => window.open(RamayanaPDF, "_blank")} className="text-sm font-semibold text-orange-600 hover:text-orange-700">

          View All

        </button>

      </div>

      {/* Story List */}

      <div className="space-y-3">

        {stories.map((story) => (

          <div
            key={story.id}
            className="group flex items-center gap-3 rounded-2xl border border-orange-100 p-3 transition-all duration-300 hover:bg-orange-50 hover:shadow-md"
          >

            <img
              src={storyImages[story.image]}
              alt={story.title}
              className="h-16 w-16 rounded-xl object-cover"
            />

            <div className="flex-1">

              <h4 className="font-semibold text-slate-800"> 

                {story.title}

              </h4>

              <p className="mt-1 text-xs text-slate-500">

                {story.subtitle}

              </p>

            </div>

            <button
  onClick={() => onRead(story)}
  className="rounded-full bg-orange-100 px-3 py-2 text-xs font-semibold text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white"
>

  Read →

</button>

          </div>

        ))}

      </div>

    </div>

  );

}
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, CreditCard } from 'lucide-react';

interface Facility {
  imgSrc: string;
  alt: string;
  title: string;
  description: string;
}

const facilities: Facility[] = [
  {
    imgSrc: 'https://media.hudle.in/photos/59418',
    alt: 'Professional Cricket Pitch',
    title: 'Professional Cricket Pitch',
    description: 'Play on a meticulously maintained pitch designed to professional standards.',
  },
  {
    imgSrc: 'https://knowledgegk.com/wp-content/uploads/2024/02/Box-Cricket_2.jpg',
    alt: 'Floodlit Night Matches',
    title: 'Floodlit Night Matches',
    description: 'Play exciting matches under bright floodlights with perfect visibility.',
  },
  {
    imgSrc: 'https://res.cloudinary.com/purnesh/image/upload/f_auto/v1559298070/beyond-lines-h.jpg',
    alt: 'Player Lounges & Rest Areas',
    title: 'Player Lounges & Rest Areas',
    description: 'Comfortable seating and refreshment zones where players can relax and recharge.',
  },
  {
    imgSrc: 'https://th.bing.com/th/id/OIP.Pmlu027dTdts_YwoJpCpGwHaE7?rs=1&pid=ImgDetMain',
    alt: 'Professional Coaching',
    title: 'Professional Coaching & Training',
    description: 'Access expert coaches for skill development, fitness training, and strategy.',
  },
  {
    imgSrc: 'https://static.vecteezy.com/system/resources/previews/000/378/316/original/wifi-vector-icon.jpg',
    alt: 'Wi-Fi & Streaming',
    title: 'High-Speed Wi-Fi & Live Streaming',
    description: 'Stay connected with fast internet access and enjoy live streaming of matches.',
  },
  {
    imgSrc: 'https://i.pinimg.com/originals/2c/73/29/2c7329560702d29cbe9af756e730b464.jpg',
    alt: 'Parking',
    title: 'Parking Space',
    description: 'Convenient and secure parking for players and visitors close to the facility entrance.',
  },
  {
    imgSrc: 'https://images.pexels.com/photos/3935484/pexels-photo-3935484.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Cafeteria & Refreshments',
    title: 'Cafeteria & Refreshments',
    description: 'Enjoy snacks, beverages, and healthy refreshments before or after your game.',
  },
  {
    imgSrc: 'https://images.pexels.com/photos/896922/pexels-photo-896922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'First Aid & Medical Support',
    title: 'First Aid & Medical Support',
    description: 'On-site first aid services and quick access to medical support to ensure safety.',
  },
];

interface FacilityCardSmallProps {
  imgSrc: string;
  alt: string;
  title: string;
  description: string;
}

const FacilityCardSmall: React.FC<FacilityCardSmallProps> = ({
  imgSrc,
  alt,
  title,
  description,
}) => (
  <div className="min-w-[250px] max-w-[250px] bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0">
    <img src={imgSrc} alt={alt} className="w-full h-40 object-cover" />
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-gray-600 text-sm line-clamp-3">{description}</p>
    </div>
  </div>
);

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="relative bg-green-700 text-white">
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
        <div
          className="relative z-10 py-20 px-4 container mx-auto flex flex-col items-center text-center"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay',
          }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Cricket Box
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            Premium cricket box facility for enthusiasts. Book your slot today!
          </p>
          <Link
            to="/booking"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Book Slot Now
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center transform transition-transform duration-300 hover:scale-105">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-green-100 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Pick Your Date</h3>
              <p className="text-gray-600">
                Choose from our available dates to play your cricket match.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center transform transition-transform duration-300 hover:scale-105">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-green-100 rounded-full mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Select Time Slot</h3>
              <p className="text-gray-600">
                Browse available time slots and select the ones that work for you.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center transform transition-transform duration-300 hover:scale-105">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-green-100 rounded-full mb-4">
                <CreditCard className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Pay & Play</h3>
              <p className="text-gray-600">
                Complete the payment using UPI and confirm your booking instantly.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/booking"
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
            >
              Book a slot now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Auto-scroll Facilities Slider Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Our Premium Facilities</h2>

          <div className="relative overflow-hidden">
            <div className="flex space-x-4 animate-scroll">
              {[...Array(2)].map((_, loopIndex) =>
                facilities.map(({ imgSrc, alt, title, description }, i) => (
                  <FacilityCardSmall
                    key={`${loopIndex}-${i}`}
                    imgSrc={imgSrc}
                    alt={alt}
                    title={title}
                    description={description}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </section>


      {/* Ready to Play Section */}
      <div className="mt-12 mb-16 bg-gray-50 p-8 rounded-lg container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h3 className="text-2xl font-bold mb-3">Ready to Play?</h3>
            <p className="text-gray-600 max-w-md">
              Book your cricket box slot now and enjoy the best cricket facility in town.
              Limited slots available each day!
            </p>
          </div>
          <Link
            to="/booking"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 whitespace-nowrap"
          >
            Book Your Slot
          </Link>
        </div>
      </div>

      {/* Custom styles for scroll animation */}
      <style>
        {`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-scroll {
            animation: scroll 10s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default HomePage;

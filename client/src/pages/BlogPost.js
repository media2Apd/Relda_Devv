// import React from 'react';
// import { useParams, Link } from 'react-router-dom';
// import blog1 from '../assest/Blog/blog-1.jpg';
// import blog2 from '../assest/Blog/blog-2.jpg';
// import blog3 from '../assest/Blog/blog-3.jpg';
// import blog4 from '../assest/Blog/blog-4.jpg';
// import blog5 from '../assest/Blog/blog-5.jpg';
// import blog6 from '../assest/Blog/blog-6.jpg';
// import { IoLogoFacebook } from 'react-icons/io5';
// import { BsTwitterX } from 'react-icons/bs';

// const BlogPost = () => {
//     const { id } = useParams(); // Get the post ID from the URL

//     // Simulate fetching posts
//     const posts = [
//         {
//             id: 1,
//             title: "Next Gen TV",
//             category: "RELDA EDITION",
//             content: <p className='text-gray-300'>Next Gen TV, also known as ATSC 3.0, is the latest version of television broadcasting technology that offers several new features and improvements over the previous standard. Here are some of the key features of Next Gen TV:<br></br>
//             <br></br><strong className='text-white'>4K and HDR :</strong> Next Gen TV supports Ultra High Definition (UHD) 4K resolution and High Dynamic Range (HDR) for improved picture quality.<br></br>
//             <br></br><strong className='text-white'>Interactive content :</strong> Next Gen TV allows broadcasters to deliver interactive content, such as polls, quizzes, and other features, directly to viewers' screens.<br></br>
//             <br></br><strong className='text-white'>Personalization :</strong> Next Gen TV supports targeted advertisements, as well as personalized content recommendations based on viewers' interests and viewing habits.<br></br>
//             <br></br><strong className='text-white'>Enhanced audio :</strong> Next Gen TV supports immersive audio formats like Dolby Atmos and DTS:X for improved sound quality.<br></br>
//             <br></br><strong className='text-white'>Emergency alerts :</strong> Next Gen TV supports more advanced emergency alerts, such as geo-targeted warnings, that can be delivered directly to viewers' screens.<br></br>
//             <br></br><strong className='text-white'>Mobility :</strong>  Next Gen TV is designed to support mobile devices, allowing viewers to watch TV content on their smartphones and tablets while on the go.<br></br>
//             <br></br><strong className='text-white'>Improved reception :</strong> Next Gen TV offers improved reception, even in areas with weak signals or interference.<br></br>
//             <br></br>These are just a few of the features of Next Gen TV. As this our elda tv technology is still in the early stages of adoption, there may be additional features and improvements in the future.
//             </p>,
//             image: blog1,
//         },
//         {
//             id: 2,
//             title: "7 RSN Why LED TV is the Ultimate Home Entertainment Experience",
//             category: "RELDA EDITION",
//             content: <p className='text-gray-300'>LED TVs have become a popular choice for home entertainment setups. With advanced technology, high-quality displays, and sleek designs, LED TVs offer a unique and immersive viewing experience. In this blog post, we'll highlight 7 reasons why an LED TV is the ultimate home entertainment experience.<br></br>
//             <br></br><strong className='text-white'>Vivid Color Displays :</strong> LED TVs use advanced color technology to produce more vibrant and accurate colors. This means that your favorite movies, shows, and games will look more lifelike and immersive.<br></br>
//             <br></br><strong className='text-white'>High-Quality Resolution :</strong> With resolutions up to 4K Ultra HD, LED TVs offer a level of clarity and detail that can make you feel like you're right in the action. Every image is crisp and sharp, with even the tiniest details visible on screen.<br></br>
//             <br></br><strong className='text-white'>Smooth Motion Technology :</strong> LED TVs offer advanced motion technology that reduces blur and ensures a smooth viewing experience. Whether you're watching a fast-paced action scene or a sports game, you'll be able to keep up with the action without missing a beat.<br></br>
//             <br></br><strong className='text-white'>Slim and Sleek Designs :</strong> LED TVs come in a variety of stylish designs, making them a perfect addition to any home entertainment setup. With slim bezels and sleek finishes, LED TVs can blend seamlessly into your home decor.<br></br>
//             <br></br><strong className='text-white'>Smart TV Capabilities :</strong> Many LED TVs come with smart capabilities, which means you can access popular streaming services, browse the web, and even control your smart home devices directly from your TV. This makes it easier than ever to enjoy all your favorite content in one place.<br></br>
//             <br></br><strong className='text-white'>Energy Efficiency :</strong>  LED TVs are highly energy efficient, using less power than other types of TVs. This not only saves you money on your electricity bills, but also makes LED TVs a more eco-friendly choice for your home.<br></br>
//             <br></br><strong className='text-white'>Versatile Connectivity :</strong> LED TVs offer a variety of connectivity options, allowing you to connect your TV to a range of devices, such as gaming consoles, soundbars, and more. With multiple HDMI ports and other inputs, LED TVs make it easy to enjoy all your entertainment in one place.<br></br>
//             <br></br>In conclusion, ELDA TVs offer a wide range of features and benefits that make them the ultimate home entertainment experience. With advanced technology, high-quality displays, and versatile connectivity, an ELDA TV can provide a viewing experience that is both immersive and enjoyable.
//             </p>,
//             image: blog2,
//         },
//         {
//             id: 3,
//             title: "The 13 Benefits of Watching TV",
//             category: "RELDA EDITION",
//             content: <p className='text-gray-300'>According to the Globe and Mail, Canadians watched an average of 30 hours of TV in 2017. Not surprising considering we are in the ‘golden age of TV’. But is all that TV watching good for us? Well, like most things, it’s all about balance. But in case you were feeling bad about your TV binge-watching, let us alleviate some of your concerns. Watching TV can actually be quite beneficial! Here are 13 reasons why.<br></br>
//             <br></br><strong className='text-white'>Educational :</strong> TV has many educational benefits for children and adults.  TV can be used as a learning tool both at home and in the classroom.  With the wide range of TV channels, we offer you can certainly find the perfect mix of educational programming for your children or for yourself. Examples include: Book television, the Science Channel or the Discovery channel.<br></br>
//             <br></br><strong className='text-white'>Stay Current :</strong> TV is a source of news. Tuning in to local news allows civilians to stay informed with what is happening in their city.  International news shows keep you up-to-date with breaking news around the world.  As well, in the wake of global warming, the weather channel is vitally important because it gives us information about tornado warnings, hurricanes and more.<br></br>
//             <br></br><strong className='text-white'>Get Cultured :</strong> TV can provide a cheap escape instead of travelling. Exposing yourself to the cultures of the world can be easily done from behind a TV screen. Turn on a new season of BBC’s Planet Earth and unwind to the beautiful images on the screen.<br></br>
//             <br></br><strong className='text-white'>Crazy Fandoms are Fun :</strong> TV can make you feel like you are part of a group and let you participate in a subculture.  As TV shows have improved in quality, we have gotten better at watching.  We pay attention to more details and showrunners become more creative with subtle details they include as they create plot twists and turns.  People gather in fandoms to discuss their favourite TV shows and create their own subculture centred around appreciating their favourite shows and characters.  An article in the New York Times by David Carr states “The vast wasteland of television has been replaced by an excess of excellence”.  At times it can be hard to keep up with all the awesome shows available.<br></br>
//             <br></br><strong className='text-white'>Feel the Connection :</strong> TV can make you feel less lonely.  In some ways watching TV can act as a filler for spending time with friends and family. In a study from the journal of Experimental Social Psychology, researchers found that while watching a favourite TV show people reported feeling less lonely.  As well, if a certain show, news item or sports game has enough cultural weight it has the ability to bring people together to root for a common goal.  The best recent example of this is the 2019 Raptors victory! <br></br>
//             <br></br><strong className='text-white'>Family Bonding :</strong>  Family bonding is a great benefit of watching TV.  Spending time together as a family watching a television program provides a chance for everyone to connect and unwind.  Bonding over a favourite TV show provides opportunity for lifelong memories.<br></br>
//             <br></br><strong className='text-white'>Learn a Language :</strong> Expose yourself to new languages you want to learn. A great way to help learn a new language is to watch TV shows in the foreign language you are interested in learning. Many people all over the world learn English through American TV shows.  Listening and reading subtitles is a great way to passively learn.<br></br>
//             <br></br><strong className='text-white'>Mental Health :</strong> There are many health benefits to watching TV.  If a certain show makes you laugh there are health benefits to that. Laughter is the best medicine!  If you decide to watch TV while you are exercising, this can provide a distraction allowing you to do cardio for a longer period of time.  A study from the University of Rochester found that people are more energetic after watching nature scenes.<br></br>
//             <br></br><strong className='text-white'>Save Money :</strong> TV provides a cheap form of entertainment. If you compare it to going out to the movies or to a live show, it is certainly the economical choice! <br></br>
//             <br></br><strong className='text-white'>Fight Temptation :</strong> TV can improve your self control.  An interesting study by the University of Buffalo found that watching TV regularly can help maintain our ability to fight temptation.  The research psychologist that made this study found that watching a “familiar fictional world” helps people to control their impulses.  The social nature of watching your favourite TV show provides comfort which contributes to your ability to control your impulses. <br></br>
//             <br></br><strong className='text-white'>Relieve Stress :</strong> TV can relieve your stress.  According to a study done at the University of California found that watching more TV can reduce your cortisol levels.  Cortisol is nick-named the “stress hormone”.  It is a cause for concern because it can increase weight gain, cholesterol and depression.  So if watching your favourite shows reduces this in any way then it's time to tune in to prime time TV. <br></br>
//             <br></br><strong className='text-white'>Get Inspired :</strong> TV can inspire you or your kids to try new things or pick up a new hobby.  If kids see their favourite characters engaged in activities they have never tried before they are more likely to want to try those things too! This can create more “unplugged” learning.  The same situation can happen for you, if you're watching your favourite HGTV show about home renovations perhaps this will encourage you to crack open a can of paint and upgrade your home! Shows on HGTV can provide many different ideas to boost your home décor creativity. TV also provides an opportunity to learn about different occupations and can help inspire kids and adults to pursue new career avenues. <br></br>
//             <br></br><strong className='text-white'>Watch TV to Read More? :</strong> TV can motivate you to read more books! If you see a show that you really enjoyed and investigate a little further, sometimes you can discover that it was based on a book. For example: Game of Thrones, the bestselling book series by George R.R. Martin, The Handmaid’s Tale by Margaret Atwood or Big Little Lies by David E. Kelley.  TV can provide some visuals to help you picture the words when you read these books. <br></br>
//             <br></br>These benefits certainly opened our eyes and made us feel good about our decision to binge-watch the latest season of Letterkenny on Crave.  If you are interested in our TV services check out our TV page to learn more and find the channels that are right for you and your family!  If you are interested in adding TV service to your business check out our Business TV page to learn more!.
//             </p>,
//             image: blog3,
//         },
//         {
//             id: 4,
//             title: "A Comprehensive Guide to OTT Advertising",
//             category: "RELDA EDITION",
//             content: <p className='text-gray-300'>OTT is ushering in a new era of awareness marketing. In the past, it required millions of dollars to run a TV commercial that would reach a wide range of audiences. ‘Over-the-top’ platforms remove the barrier of entry for growing brands into TV advertising. Today, OTT allows brands to tightly target only your audience and create awareness with a fraction of the budget of traditional TV.<br></br>
//             <br></br>High-quality video content is now easily accessible across all connected devices, including:<br></br>
//             <br></br>Mobile devices<br></br>
//             PC<br></br>
//             Smart TV/Connected TV<br></br>
//             Streaming devices<br></br>
//             Gaming consoles<br></br>
//             Did you know that videos streamed through OTT services, like Amazon, Netflix,  Disney Plus , and other video streaming platforms account for 25% of the collective consumer viewing time?<br></br>
//             <br></br>Streaming video advertising connects brands with receptive viewers through sight, sound, and motion. Streaming allows brands to optimize their ads with advanced data and modern machine learning. In the following guide, we’ll discuss:<br></br>
//             <br></br><strong className='text-white'>What is OTT Advertising?</strong>
//             <br></br>OTT Statistics<br></br>
//             OTT Platforms<br></br>
//             <br></br><strong className='text-white'>Benefits of OTT Advertising</strong> 
//             <br></br>OTT Best Practices<br></br>
//             The Future of OTT<br></br>
//             <br></br><strong className='text-white'>Get Cultured :</strong> TV can provide a cheap escape instead of travelling. Exposing yourself to the cultures of the world can be easily done from behind a TV screen. Turn on a new season of BBC’s Planet Earth and unwind to the beautiful images on the screen.<br></br>
//             <br></br><strong className='text-white'>Crazy Fandoms are Fun :</strong> TV can make you feel like you are part of a group and let you participate in a subculture.  As TV shows have improved in quality, we have gotten better at watching.  We pay attention to more details and showrunners become more creative with subtle details they include as they create plot twists and turns.  People gather in fandoms to discuss their favourite TV shows and create their own subculture centred around appreciating their favourite shows and characters.  An article in the New York Times by David Carr states “The vast wasteland of television has been replaced by an excess of excellence”.  At times it can be hard to keep up with all the awesome shows available.<br></br>
//             <br></br><strong className='text-white'>Feel the Connection :</strong> TV can make you feel less lonely.  In some ways watching TV can act as a filler for spending time with friends and family. In a study from the journal of Experimental Social Psychology, researchers found that while watching a favourite TV show people reported feeling less lonely.  As well, if a certain show, news item or sports game has enough cultural weight it has the ability to bring people together to root for a common goal.  The best recent example of this is the 2019 Raptors victory! <br></br>
//             <br></br><strong className='text-white'>Family Bonding :</strong>  Family bonding is a great benefit of watching TV.  Spending time together as a family watching a television program provides a chance for everyone to connect and unwind.  Bonding over a favourite TV show provides opportunity for lifelong memories.<br></br>
//             <br></br><strong className='text-white'>Learn a Language :</strong> Expose yourself to new languages you want to learn. A great way to help learn a new language is to watch TV shows in the foreign language you are interested in learning. Many people all over the world learn English through American TV shows.  Listening and reading subtitles is a great way to passively learn.<br></br>
//             <br></br><strong className='text-white'>Mental Health :</strong> There are many health benefits to watching TV.  If a certain show makes you laugh there are health benefits to that. Laughter is the best medicine!  If you decide to watch TV while you are exercising, this can provide a distraction allowing you to do cardio for a longer period of time.  A study from the University of Rochester found that people are more energetic after watching nature scenes.<br></br>
//             <br></br><strong className='text-white'>Save Money :</strong> TV provides a cheap form of entertainment. If you compare it to going out to the movies or to a live show, it is certainly the economical choice! <br></br>
//             <br></br><strong className='text-white'>Fight Temptation :</strong> TV can improve your self control.  An interesting study by the University of Buffalo found that watching TV regularly can help maintain our ability to fight temptation.  The research psychologist that made this study found that watching a “familiar fictional world” helps people to control their impulses.  The social nature of watching your favourite TV show provides comfort which contributes to your ability to control your impulses. <br></br>
//             <br></br><strong className='text-white'>Relieve Stress :</strong> TV can relieve your stress.  According to a study done at the University of California found that watching more TV can reduce your cortisol levels.  Cortisol is nick-named the “stress hormone”.  It is a cause for concern because it can increase weight gain, cholesterol and depression.  So if watching your favourite shows reduces this in any way then it's time to tune in to prime time TV. <br></br>
//             <br></br><strong className='text-white'>Get Inspired :</strong> TV can inspire you or your kids to try new things or pick up a new hobby.  If kids see their favourite characters engaged in activities they have never tried before they are more likely to want to try those things too! This can create more “unplugged” learning.  The same situation can happen for you, if you're watching your favourite HGTV show about home renovations perhaps this will encourage you to crack open a can of paint and upgrade your home! Shows on HGTV can provide many different ideas to boost your home décor creativity. TV also provides an opportunity to learn about different occupations and can help inspire kids and adults to pursue new career avenues. <br></br>
//             <br></br><strong className='text-white'>Watch TV to Read More? :</strong> TV can motivate you to read more books! If you see a show that you really enjoyed and investigate a little further, sometimes you can discover that it was based on a book. For example: Game of Thrones, the bestselling book series by George R.R. Martin, The Handmaid’s Tale by Margaret Atwood or Big Little Lies by David E. Kelley.  TV can provide some visuals to help you picture the words when you read these books. <br></br>
//             <br></br>These benefits certainly opened our eyes and made us feel good about our decision to binge-watch the latest season of Letterkenny on Crave.  If you are interested in our TV services check out our TV page to learn more and find the channels that are right for you and your family!  If you are interested in adding TV service to your business check out our Business TV page to learn more!.
//             </p>,
//             image: blog4,
//         },
//         {
//             id: 5,
//             title: "A Smart Way To Save Your Money",
//             category: "RELDA EDITION",
//             content: "Smart ways to save money using modern tech...",
//             image: blog5,
//         },
//         {
//             id: 6,
//             title: "The History of LED",
//             category: "RELDA EDITION",
//             content: "The history of LED technology is fascinating...",
//             image: blog6,
//         },
//     ];

//     // Find the post by ID from the URL
//     const post = posts.find((p) => p.id === parseInt(id));

//     // If post is not found, return a 404 message or redirect
//     if (!post) {
//         return <div className="text-white text-center py-8">Post not found!</div>;
//     }

//     // Recent posts can remain static or be filtered
//     const recentPosts = posts.filter((p) => p.id !== post.id);

//     return (
//         <div className="bg-black text-white py-8 px-4">
//             <div className="max-w-7xl mx-auto">
//                 <Link to="/blog-page" className="flex text-gray-400 hover:underline">All Posts</Link>
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
//                     <div className="lg:col-span-2">
//                         <img src={post.image} alt={post.title} className="w-full h-100 object-cover mb-6" />
//                         <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
//                         <p className="text-sm text-gray-400 mb-8"> | {post.category}</p>
//                         <p>{post.content}</p>
//                         <div className='flex justify-left space-x-4 mt-6'>
//                           <p className='text-white'>Share this post :</p>
//                           <Link to="https://www.facebook.com/eldaelectronics" className='text-2xl text-gray-400 hover:text-white'><IoLogoFacebook/></Link>
//                           <Link to="https://x.com/i/flow/login?redirect_after_login=%2FElectronicsElda" className='text-2xl text-gray-400 hover:text-white'><BsTwitterX/></Link>
//                         </div>
//                     </div>
//                     <aside className="lg:col-span-1">
//                         <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
//                         <ul>
//                             {recentPosts.map((recent) => (
//                                 <li key={recent.id} className="mb-4">
//                                     <Link to={`/blog-post/${recent.id}`} className="flex items-center space-x-4">
//                                         <img src={recent.image} alt={recent.title} className="w-16 h-16 object-cover" />
//                                         <span className="hover:underline">{recent.title}</span>
//                                     </Link>
//                                 </li>
//                             ))}
//                         </ul>
//                     </aside>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BlogPost;
// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { IoLogoFacebook } from 'react-icons/io5';
// import { BsTwitterX } from 'react-icons/bs';

// const BlogPost = () => {
//     const { id } = useParams(); // Get the post ID from the URL

//     const [post, setPost] = useState(null); // State to store the post
//     const [loading, setLoading] = useState(true); // State to manage loading state
//     const [error, setError] = useState(null); // State to handle errors

//     // Fetch the post data
//     useEffect(() => {
//         const fetchPost = async () => {
//             try {
//                 const response = await fetch(`http://localhost:8080/api/get-blog/${id}`); // Replace with your API endpoint
//                 const data = await response.json();
                
//                 if (data.success) {
//                     setPost(data.blogPost); // Store the fetched blog post in the state
//                 } else {
//                     setError('Post not found');
//                 }
//                 setLoading(false); // Set loading to false once data is fetched
//             } catch (err) {
//                 setError('Failed to fetch post'); // Set error if fetching fails
//                 setLoading(false);
//             }
//         };

//         fetchPost();
//     }, [id]); // Fetch data when the component mounts or the post ID changes

//     // If the post is still loading, show a loading message
//     if (loading) {
//         return <div className="text-white text-center py-8">Loading...</div>;
//     }

//     // If there's an error (or post not found), show an error message
//     if (error) {
//         return <div className="text-white text-center py-8">{error}</div>;
//     }

//     // If post is not found, return a 404 message or redirect
//     if (!post) {
//         return <div className="text-white text-center py-8">Post not found!</div>;
//     }

//     return (
//         <div className="bg-black text-white py-8 px-4">
//             <div className="max-w-7xl mx-auto">
//                 <Link to="/blog-page" className="flex text-gray-400 hover:underline">All Posts</Link>
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
//                     <div className="lg:col-span-2">
//                         <img src={post.image} alt={post.title} className="w-full h-100 object-cover mb-6" />
//                         <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
//                         <p className="text-sm text-gray-400 mb-8"> | {post.category}</p>
//                         <p>{post.content}</p>
//                         <div className="flex justify-left space-x-4 mt-6">
//                           <p className="text-white">Share this post :</p>
//                           <Link to="https://www.facebook.com/eldaelectronics" className="text-2xl text-gray-400 hover:text-white">
//                             <IoLogoFacebook />
//                           </Link>
//                           <Link to="https://x.com/i/flow/login?redirect_after_login=%2FElectronicsElda" className="text-2xl text-gray-400 hover:text-white">
//                             <BsTwitterX />
//                           </Link>
//                         </div>
//                     </div>
//                     <aside className="lg:col-span-1">
//                         <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
//                         {/* You can handle recent posts here if you have them */}
//                         {/* For now, you can assume you don't have recent posts, or you can fetch them similarly */}
//                     </aside>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BlogPost;
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SummaryApi from "../common";

const BlogPost = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recentPosts, setRecentPosts] = useState([]);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setError(null); // Reset error state

        // Fetch the blog post
        fetch(SummaryApi.getOneBlog(id).url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (!data || !data._id) {
                    throw new Error("Blog content is missing");
                }
                setBlog(data); // Directly using the data object
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching blog:", error);
                setLoading(false);
                setError("Error fetching blog data.");
            });

        // Fetch recent posts
        fetch(SummaryApi.getBlogs.url)
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    const filteredPosts = data.filter(p => String(p._id) !== String(id));
                    setRecentPosts(filteredPosts);
                } else {
                    setError("Error fetching recent posts.");
                }
            })
            .catch((error) => {
                console.error("Error fetching recent posts:", error);
                setError("Error fetching recent posts.");
            });
    }, [id]);

    const renderContent = (contentArray) => {
        return contentArray.map((item, index) => (
            <div key={index} className="mb-4">
                {item.subtitle && <h3 className="font-semibold text-xl mb-2">{item.subtitle}</h3>}
                <p>{item.content}</p>
            </div>
        ));
    };

    if (loading) return <p className="text-center text-gray-400">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!blog) return <p className="text-center text-red-500">Blog not found!</p>;

    return (
        <div className="bg-black text-white py-10 px-6">
            <div className="max-w-7xl mx-auto">
                <Link to="/blog-page" className="text-gray-400 font-semibold hover:underline mb-6 block">&larr; Back to All Posts</Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Blog Content */}
                    <div className="lg:col-span-2">
                    <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="w-full max-h-[650px] object-contain mb-6 rounded-lg"
                        />

                        <h1 className="text-3xl font-extrabold leading-tight mb-4">{blog.title}</h1>
                        <p className="text-md text-gray-400 mb-4">Category: {blog.category}</p>

                        {/* Blog Content Section */}
                        <div className="text-lg text-justify leading-relaxed">
                            {Array.isArray(blog.content) ? (
                                renderContent(blog.content)
                            ) : (
                                <p>{blog.content}</p>
                            )}
                        </div>

                        {/* Responsive Read More for small screens */}
                        {Array.isArray(blog.content) && blog.content.length > 0 && (
                            <div className="lg:hidden mt-6">
                                <p className={`transition-all duration-300 overflow-hidden ${expanded ? "max-h-fit" : "max-h-[120px]"}`}>
                                    {expanded
                                        ? blog.content.map((item) => item.content).join(" ")
                                        : `${blog.content[0].content.slice(0, 200)}...`}
                                </p>
                                <button
                                    onClick={() => setExpanded(!expanded)}
                                    className="text-blue-400 mt-2 font-semibold hover:underline"
                                >
                                    {expanded ? "Read Less" : "Read More"}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Recent Posts */}
                    <aside className="lg:col-span-1 bg-gray-900 p-5 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4 text-gray-200">Recent Posts</h2>
                        {recentPosts.length > 0 ? (
                            <ul className="space-y-4">
                                {recentPosts.map((recent) => (
                                    <li key={recent._id} className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition">
                                        <Link to={`/blog-post/${recent._id}`} className="flex items-center space-x-4">
                                            <img
                                                src={recent.imageUrl}
                                                alt={recent.title}
                                                className="w-18 h-16 object-contain rounded-md"
                                            />
                                            <span className="text-gray-300 hover:text-white">{recent.title}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400">No recent posts available.</p>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default BlogPost;

import React, { useRef, useState } from "react";
import "daisyui/dist/full.css";
import { FaGithub, FaLinkedin, FaPhone, FaEnvelope } from "react-icons/fa";
import * as htmlToImage from "html-to-image";
import { jsPDF } from "jspdf";

const Resume = ({ data }) => {
  const resumeRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleDownloadPdf = async () => {
    if (!resumeRef.current) return;
    setLoading(true);
    const resume = resumeRef.current;

    try {
      const canvas = await htmlToImage.toCanvas(resume, {
        pixelRatio: 3,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Scale image to fit page width
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${data?.personalInformation?.fullName || "resume"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div
        ref={resumeRef}
        className="max-w-4xl mx-auto shadow-xl rounded-lg p-10 space-y-6 bg-white text-gray-800 border border-gray-200 transition-all duration-300"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-blue-600">
            {data?.personalInformation?.fullName}
          </h1>
          <p className="text-lg text-gray-500">
            {data?.personalInformation?.location}
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm">
            {data?.personalInformation?.email && (
              <a
                href={`mailto:${data.personalInformation.email}`}
                className="flex items-center text-gray-600 hover:text-blue-600"
              >
                <FaEnvelope className="mr-2" /> {data.personalInformation.email}
              </a>
            )}
            {data?.personalInformation?.phoneNumber && (
              <span className="flex items-center text-gray-600">
                <FaPhone className="mr-2" />{" "}
                {data.personalInformation.phoneNumber}
              </span>
            )}
            {data?.personalInformation?.gitHub && (
              <a
                href={data.personalInformation.gitHub}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <FaGithub className="mr-2" /> GitHub
              </a>
            )}
            {data?.personalInformation?.linkedIn && (
              <a
                href={data.personalInformation.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaLinkedin className="mr-2" /> LinkedIn
              </a>
            )}
          </div>
        </div>

        <div className="divider"></div>

        {/* Summary */}
        {data?.summary && (
          <section>
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">
              Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{data.summary}</p>
          </section>
        )}

        {/* Skills */}
        {data?.skills?.length > 0 && (
          <>
            <div className="divider"></div>
            <section>
              <h2 className="text-2xl font-semibold text-blue-600 mb-2">
                Skills
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {data.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-md px-4 py-2 text-center text-gray-700"
                  >
                    {skill.title}
                    {skill.level && (
                      <span className="text-sm text-gray-500">
                        {" "}
                        — {skill.level}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Experience */}
        {data?.experience?.length > 0 && (
          <>
            <div className="divider"></div>
            <section>
              <h2 className="text-2xl font-semibold text-blue-600 mb-2">
                Experience
              </h2>
              {data.experience.map((exp, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <h3 className="text-xl font-bold">{exp.jobTitle}</h3>
                  <p className="text-gray-600">
                    {exp.company} | {exp.location}
                  </p>
                  <p className="text-gray-500">{exp.duration}</p>
                  <p className="mt-2 text-gray-700">{exp.responsibility}</p>
                </div>
              ))}
            </section>
          </>
        )}

        {/* Education */}
        {data?.education?.length > 0 && (
          <>
            <div className="divider"></div>
            <section>
              <h2 className="text-2xl font-semibold text-blue-600 mb-2">
                Education
              </h2>
              {data.education.map((edu, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <h3 className="text-xl font-bold">{edu.degree}</h3>
                  <p className="text-gray-600">
                    {edu.university}, {edu.location}
                  </p>
                  <p className="text-gray-500">
                    🎓 Graduation Year: {edu.graduationYear}
                  </p>
                </div>
              ))}
            </section>
          </>
        )}

        {/* Certifications */}
        {data?.certifications?.length > 0 && (
          <>
            <div className="divider"></div>
            <section>
              <h2 className="text-2xl font-semibold text-blue-600 mb-2">
                Certifications
              </h2>
              {data.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <h3 className="text-xl font-bold">{cert.title}</h3>
                  <p className="text-gray-600">
                    {cert.issuingOrganization} — {cert.year}
                  </p>
                </div>
              ))}
            </section>
          </>
        )}

        {/* Projects */}
        {data?.projects?.length > 0 && (
          <>
            <div className="divider"></div>
            <section>
              <h2 className="text-2xl font-semibold text-blue-600 mb-2">
                Projects
              </h2>
              {data.projects.map((proj, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <h3 className="text-xl font-bold">{proj.title}</h3>
                  <p className="text-gray-700">{proj.description}</p>
                  {proj.technologiesUsed?.length > 0 && (
                    <p className="text-gray-500 mt-1">
                      🛠 Technologies: {proj.technologiesUsed.join(", ")}
                    </p>
                  )}
                  {proj.githubLink && (
                    <a
                      href={proj.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline block mt-1"
                    >
                      🔗 GitHub Link
                    </a>
                  )}
                </div>
              ))}
            </section>
          </>
        )}

        {/* Achievements */}
        {data?.achievements?.length > 0 && (
          <>
            <div className="divider"></div>
            <section>
              <h2 className="text-2xl font-semibold text-blue-600 mb-2">
                Achievements
              </h2>
              {data.achievements.map((ach, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <h3 className="text-xl font-bold">{ach.title}</h3>
                  <p className="text-gray-600">{ach.year}</p>
                  <p className="text-gray-700">{ach.extraInformation}</p>
                </div>
              ))}
            </section>
          </>
        )}

        {/* Languages */}
        {data?.languages?.length > 0 && (
          <>
            <div className="divider"></div>
            <section>
              <h2 className="text-2xl font-semibold text-blue-600 mb-2">
                Languages
              </h2>
              <ul className="list-disc pl-6 text-gray-700">
                {data.languages.map((lang, idx) => (
                  <li key={idx}>{lang.name}</li>
                ))}
              </ul>
            </section>
          </>
        )}

        {/* Interests */}
        {data?.interests?.length > 0 && (
          <>
            <div className="divider"></div>
            <section>
              <h2 className="text-2xl font-semibold text-blue-600 mb-2">
                Interests
              </h2>
              <ul className="list-disc pl-6 text-gray-700">
                {data.interests.map((int, idx) => (
                  <li key={idx}>{int.name}</li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>

      {/* Download Button */}
      <section className="flex justify-center mt-6">
        <button
          onClick={handleDownloadPdf}
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Generating PDF..." : "Download as PDF"}
        </button>
      </section>
    </>
  );
};

export default Resume;

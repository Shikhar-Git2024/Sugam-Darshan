export const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);

  if (!section) return;

  const navbarHeight = 110;

  const y =
    section.getBoundingClientRect().top +
    window.pageYOffset -
    navbarHeight;

  window.scrollTo({
    top: y,
    behavior: "smooth",
  });

  let animationClass = "highlight-orange";

  switch (sectionId) {
    case "virtual-tour":
      animationClass = "highlight-blue";
      break;

    case "mantras":
      animationClass = "highlight-purple";
      break;

    case "pilgrim-guide":
      animationClass = "highlight-green";
      break;

    case "stories":
      animationClass = "highlight-orange";
      break;

    case "aarti":
      animationClass = "highlight-orange";
      break;

    default:
      animationClass = "highlight-orange";
  }

  setTimeout(() => {
    section.classList.add(animationClass);

    setTimeout(() => {
      section.classList.remove(animationClass);
    }, 900);

  }, 500);
};
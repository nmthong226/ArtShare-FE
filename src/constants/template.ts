// templates.tsx

/**
 * Art tutorial scaffold with inline styles, 1.5 spacing, bold/colored headings,
 * and a “dashed-border” placeholder instead of a broken <img> tag.
 */
export const TUTORIAL_TEMPLATE_HTML = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Art Tutorial</title>
  </head>
  <body>
    <div
      style="
        font-family: Arial, sans-serif;
        color: #333333;
        max-width: 800px;
        margin: 40px auto;
        padding: 0 20px;
      "
    >
      <!-- Main Title -->
      <h1
        style="
          font-size: 2.5em;
          color: #1a73e8;
          margin-bottom: 0.25em;
          padding-bottom: 10px;
          border-bottom: 2px solid #e0e0e0;
          line-height: 1.5;
          font-weight: bold;
        "
      >
        🎨 How to Create Your Masterpiece
      </h1>
      <p style="margin: 0.75em 0; font-size: 1.1em; line-height: 1.5;">
        Follow these steps to take your concept from initial inspiration
        <strong>all the way</strong> to a polished final artwork.
      </p>

      <!-- Step 1: Inspiration & Concept -->
      <section style="margin-bottom: 2em;">
        <h2
          style="
            font-size: 1.8em;
            color: #1a73e8;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            line-height: 1.5;
            font-weight: bold;
          "
        >
          Step 1: Inspiration &amp; Concept
        </h2>
        <p style="margin: 0.75em 0; font-size: 1.1em; line-height: 1.5;">
          Begin by gathering references—mood boards, color palettes, or
          sketches—and define the theme you wish to explore.
        </p>
        <blockquote
          style="
            margin: 1.5em 0;
            padding: 1em 1.25em;
            background-color: #f1f3f4;
            border-left: 4px solid #1a73e8;
            font-style: italic;
            color: #555555;
            line-height: 1.5;
          "
        >
          “Art enables us to find ourselves and lose ourselves at the same time.” – Thomas Merton
        </blockquote>
      </section>

      <!-- Step 2: Sketching the Outline -->
      <section style="margin-bottom: 2em;">
        <h2
          style="
            font-size: 1.8em;
            color: #1a73e8;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            line-height: 1.5;
            font-weight: bold;
          "
        >
          Step 2: Sketching the Outline
        </h2>
        <p style="margin: 0.75em 0; font-size: 1.1em; line-height: 1.5;">
          Create a rough sketch with pencil or digital tool. Focus on
          composition, balance, and the flow of your subject’s movement.
        </p>
      </section>

      <!-- Step 3: Color Blocking -->
      <section style="margin-bottom: 2em;">
        <h2
          style="
            font-size: 1.8em;
            color: #1a73e8;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            line-height: 1.5;
            font-weight: bold;
          "
        >
          Step 3: Color Blocking
        </h2>
        <p style="margin: 0.75em 0; font-size: 1.1em; line-height: 1.5;">
          Lay down your base colors. Consider a harmonious palette—e.g.,
          pastel blues (<strong>#AECBFA</strong>), muted corals (<strong>#F4A261</strong>),
          and earthy greens (<strong>#2A9D8F</strong>).
        </p>
        <ul style="margin: 0.75em 0; padding-left: 1.25em; line-height: 1.5;">
          <li>Use large brushes or fill tools to establish big color shapes.</li>
          <li>Experiment with opacity to find the right tonal value.</li>
        </ul>
      </section>

      <!-- Step 4: Detailing & Textures -->
      <section style="margin-bottom: 2em;">
        <h2
          style="
            font-size: 1.8em;
            color: #1a73e8;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            line-height: 1.5;
            font-weight: bold;
          "
        >
          Step 4: Detailing & Textures
        </h2>
        <p style="margin: 0.75em 0; font-size: 1.1em; line-height: 1.5;">
          Refine details, add texture, and play with light and shadow. Use
          layering techniques or generative AI brushes for extra depth.
        </p>
      </section>

      <!-- Step 5: Final Touches & Export -->
      <section style="margin-bottom: 2em;">
        <h2
          style="
            font-size: 1.8em;
            color: #1a73e8;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            line-height: 1.5;
            font-weight: bold;
          "
        >
          Step 5: Final Touches & Export
        </h2>
        <p style="margin: 0.75em 0; font-size: 1.1em; line-height: 1.5;">
          Polish highlights and shadows, adjust contrast, and ensure all
          elements feel cohesive. Export at <strong>300 dpi</strong> or higher
          for print.
        </p>
      </section>

      <!-- Final Artwork Placeholder -->
      <div
        style="
          text-align: center;
          margin-top: 3em;
        "
      >
        <h2
          style="
            font-size: 1.8em;
            color: #1a73e8;
            margin-bottom: 0.5em;
            line-height: 1.5;
            font-weight: bold;
          "
        >
          🌟 Final Artwork
        </h2>
        <p style="margin: 0.75em 0; font-size: 1.1em; line-height: 1.5;">
          Insert your completed artwork below:
        </p>

        <!-- Dashed-border placeholder instead of broken <img> -->
        <div
          style="
            width: 100%;
            height: 300px;
            border: 2px dashed #cccccc;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #888888;
            font-style: italic;
            line-height: 1.5;
          "
        >
          [ Final Artwork Placeholder ]
        </div>
      </div>
    </div>
  </body>
</html>
`;

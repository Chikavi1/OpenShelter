ALTER TABLE shelter_settings ADD COLUMN IF NOT EXISTS about_content jsonb NOT NULL DEFAULT '{
  "heroKicker": "Quiénes somos",
  "heroTitle": "No salvamos mascotas.",
  "heroHighlight": "Salvamos futuros.",
  "heroDescription": "Rescatamos, rehabilitamos y conectamos mascotas increíbles con familias amorosas. Nacimos de un grupo de vecinos que decidió no mirar hacia otro lado.",
  "storyImageUrl": "https://images.unsplash.com/photo-1636604244109-7b26dd38dd91?q=80&w=880&auto=format&fit=crop",
  "storyKicker": "Nuestra historia",
  "storyTitle": "De un rescate a una red de apoyo",
  "storyParagraphs": [
    "Empezamos rescatando a uno. Hoy somos una comunidad de voluntarios, veterinarios, hogares temporales y familias que han decidido que ningún animal se quede atrás. Cada caso nos enseña que con cuidado, paciencia y compromiso, una vida puede cambiar por completo.",
    "Trabajamos en CDMX y colaboramos con hogares temporales en toda la zona metropolitana. Todo lo que hacemos se sostiene con donativos y trabajo voluntario."
  ],
  "valuesKicker": "Lo que nos mueve",
  "valuesTitle": "Nuestros valores",
  "valuesDesc": "No somos un albergue masivo. Somos una red pequeña que hace las cosas con cuidado, para que cada adopción dure para siempre.",
  "values": [
    {"title": "Rescate con respeto", "desc": "Cada intervención prioriza el bienestar del animal, sin violencia y con acompañamiento veterinario."},
    {"title": "Adopción responsable", "desc": "Evaluamos compatibilidad, damos seguimiento y acompañamos a la familia después de la entrega."},
    {"title": "Transparencia total", "desc": "Cada donativo se reporta y cada historia se comparte. Nada se esconde."},
    {"title": "Comunidad que acompaña", "desc": "Voluntarios, hogares temporales y padrinos hacen posible lo que solos no podríamos."}
  ],
  "stepsKicker": "Cómo trabajamos",
  "stepsTitle": "Del rescate al hogar",
  "stepsDesc": "Un proceso claro, humano y con seguimiento. No entregamos mascotas a la ligera.",
  "steps": [
    {"n": "01", "title": "Rescate", "desc": "Rescatamos reportes de abandono, maltrato o extravío y damos atención inmediata."},
    {"n": "02", "title": "Rehabilitación", "desc": "Atención veterinaria, esterilización, vacunas, desparasitación y terapia conductual si hace falta."},
    {"n": "03", "title": "Hogar temporal", "desc": "Los rescatados conviven en hogares temporales donde recuperan confianza y rutina."},
    {"n": "04", "title": "Adopción y seguimiento", "desc": "Conectamos con la familia ideal y damos seguimiento post-adopción con visitas y apoyo."}
  ],
  "ctaKicker": "Súmate",
  "ctaTitle": "Hay muchas formas de ayudar, incluso si no puedes adoptar ahora.",
  "ctaDesc": "Dona, ofrece hogar temporal, comparte un perfil o visítanos. Cada gesto cuenta y lo agradecemos de corazón."
}'::jsonb;

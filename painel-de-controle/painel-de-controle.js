    // Screen Navigation
    function switchScreen(screenId) {
      document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
      });
      document.getElementById(screenId + '-screen').classList.add('active');

      document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
      });
      if (event && event.target) {
        event.target.classList.add('active');
      }

      window.scrollTo(0, 0);
    }

    // Logout
    function logout(event) {
      if (event) {
        event.preventDefault();
      }
      // Limpa dados de sessão/localStorage se necessário
      localStorage.removeItem('user_authenticated');
      sessionStorage.clear();
      
      // Redireciona para a página de login
      window.location.href = '../login/login-site-backoffice.html';
    }

    // Toggle User Menu
    function toggleUserMenu(event) {
      event.stopPropagation();
      const userMenuDropdown = document.getElementById('userMenuDropdown');
      userMenuDropdown.classList.toggle('active');
    }

    // Fechar menu ao clicar fora
    document.addEventListener('click', function(event) {
      const userMenuDropdown = document.getElementById('userMenuDropdown');
      const userProfile = event.target.closest('.user-profile');
      
      if (!userProfile && userMenuDropdown.classList.contains('active')) {
        userMenuDropdown.classList.remove('active');
      }
    });

    // Tab Navigation
    function switchTab(event, tabId) {
      const tabContainer = event.target.closest('.card-body');
      
      tabContainer.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
      });
      event.target.classList.add('active');

      tabContainer.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById(tabId).classList.add('active');
    }

    // Modal
    function openModal() {
      document.getElementById('demo-modal').classList.add('active');
    }

    // Element SDK Integration
    const defaultConfig = {
      app_name: "AdminPro",
      company_name: "Painel de Controle",
      dashboard_title: "Painel de Controle",
      welcome_message: "Bem-vindo de volta! Aqui está o resumo de hoje.",
      primary_color: "#1C2340",
      secondary_color: "#3B82F6",
      background_color: "#F5F7FA",
      text_color: "#2D3748",
      accent_color: "#10B981",
      font_family: "",
      font_size: 15
    };

    async function onConfigChange(config) {
      const customFont = config.font_family || defaultConfig.font_family;
      const baseSize = config.font_size || defaultConfig.font_size;
      const baseFontStack = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
      const headingFontStack = "'Poppins', sans-serif";
      const fontFamily = customFont ? `${customFont}, ${baseFontStack}` : baseFontStack;
      const headingFont = customFont ? `${customFont}, ${headingFontStack}` : headingFontStack;

      document.body.style.fontFamily = fontFamily;
      document.body.style.fontSize = `${baseSize}px`;

      const primaryColor = config.primary_color || defaultConfig.primary_color;
      const secondaryColor = config.secondary_color || defaultConfig.secondary_color;
      const backgroundColor = config.background_color || defaultConfig.background_color;
      const textColor = config.text_color || defaultConfig.text_color;
      const accentColor = config.accent_color || defaultConfig.accent_color;

      document.body.style.background = backgroundColor;
      document.body.style.color = textColor;
      document.querySelector('.admin-layout').style.background = backgroundColor;

      document.querySelectorAll('.btn-primary').forEach(el => {
        el.style.background = primaryColor;
      });

      document.querySelectorAll('.logo-title, .page-title, .card-title, .section-title').forEach(el => {
        el.style.color = primaryColor;
        el.style.fontFamily = headingFont;
      });

      document.querySelectorAll('.sidebar-header').forEach(el => {
        el.style.background = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
      });

      document.getElementById('app-name-logo').textContent = config.app_name || defaultConfig.app_name;
      document.getElementById('company-name').textContent = config.company_name || defaultConfig.company_name;
      document.getElementById('dashboard-title').textContent = config.dashboard_title || defaultConfig.dashboard_title;
      document.getElementById('welcome-message').textContent = config.welcome_message || defaultConfig.welcome_message;

      document.querySelectorAll('.page-title').forEach(el => {
        el.style.fontSize = `${baseSize * 2}px`;
      });
      document.querySelectorAll('.card-title').forEach(el => {
        el.style.fontSize = `${baseSize * 1.25}px`;
      });
    }

    function mapToCapabilities(config) {
      return {
        recolorables: [
          {
            get: () => config.primary_color || defaultConfig.primary_color,
            set: (value) => {
              config.primary_color = value;
              window.elementSdk.setConfig({ primary_color: value });
            }
          },
          {
            get: () => config.secondary_color || defaultConfig.secondary_color,
            set: (value) => {
              config.secondary_color = value;
              window.elementSdk.setConfig({ secondary_color: value });
            }
          },
          {
            get: () => config.background_color || defaultConfig.background_color,
            set: (value) => {
              config.background_color = value;
              window.elementSdk.setConfig({ background_color: value });
            }
          },
          {
            get: () => config.text_color || defaultConfig.text_color,
            set: (value) => {
              config.text_color = value;
              window.elementSdk.setConfig({ text_color: value });
            }
          },
          {
            get: () => config.accent_color || defaultConfig.accent_color,
            set: (value) => {
              config.accent_color = value;
              window.elementSdk.setConfig({ accent_color: value });
            }
          }
        ],
        borderables: [],
        fontEditable: {
          get: () => config.font_family || defaultConfig.font_family,
          set: (value) => {
            config.font_family = value;
            window.elementSdk.setConfig({ font_family: value });
          }
        },
        fontSizeable: {
          get: () => config.font_size || defaultConfig.font_size,
          set: (value) => {
            config.font_size = value;
            window.elementSdk.setConfig({ font_size: value });
          }
        }
      };
    }

    function mapToEditPanelValues(config) {
      return new Map([
        ["app_name", config.app_name || defaultConfig.app_name],
        ["company_name", config.company_name || defaultConfig.company_name],
        ["dashboard_title", config.dashboard_title || defaultConfig.dashboard_title],
        ["welcome_message", config.welcome_message || defaultConfig.welcome_message]
      ]);
    }

    if (window.elementSdk) {
      window.elementSdk.init({
        defaultConfig,
        onConfigChange,
        mapToCapabilities,
        mapToEditPanelValues
      });
    }
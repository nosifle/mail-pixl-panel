import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { supabase } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAILCOW_API_KEY = Deno.env.get('MAILCOW_API_KEY');
const MAILCOW_BASE_URL = 'https://demo.x69x.fun';

interface CreateMailboxRequest {
  local_part: string;
  domain: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface GetEmailsRequest {
  email: string;
  password: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    switch (action) {
      case 'create_account': {
        const { local_part, domain, password }: CreateMailboxRequest = await req.json();
        
        const response = await fetch(`${MAILCOW_BASE_URL}/api/v1/add/mailbox`, {
          method: 'POST',
          headers: {
            'X-API-Key': MAILCOW_API_KEY!,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            local_part,
            domain,
            password,
            password2: password,
            name: local_part,
            quota: 1024,
            active: true,
            force_pw_update: false,
            tls_enforce_in: false,
            tls_enforce_out: false,
          }),
        });

        const result = await response.json();
        console.log('Create account result:', result);

        return new Response(JSON.stringify(result), {
          status: response.ok ? 200 : 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'login': {
        const { email, password }: LoginRequest = await req.json();
        
        // Проверяем что аккаунт существует
        const response = await fetch(`${MAILCOW_BASE_URL}/api/v1/get/mailbox/${email}`, {
          method: 'GET',
          headers: {
            'X-API-Key': MAILCOW_API_KEY!,
          },
        });

        if (response.ok) {
          const accountData = await response.json();
          return new Response(JSON.stringify({
            success: true,
            account: {
              email,
              domain: email.split('@')[1],
              active: accountData.active
            }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          return new Response(JSON.stringify({
            success: false,
            error: 'Account not found'
          }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }

      case 'get_emails': {
        const { email, password }: GetEmailsRequest = await req.json();
        
        // Здесь бы нужно подключиться к IMAP серверу для получения писем
        // Пока возвращаем mock данные, так как для полной интеграции нужен IMAP клиент
        const mockEmails = [
          {
            uid: '1',
            subject: 'Добро пожаловать в x69x.fun',
            from: { name: 'Система', email: 'system@x69x.fun' },
            date: new Date().toISOString(),
            content: 'Ваш аккаунт успешно создан!',
            attachments: [],
            isRead: false
          }
        ];

        return new Response(JSON.stringify({
          success: true,
          emails: mockEmails
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'delete_account': {
        const { email } = await req.json();
        
        const response = await fetch(`${MAILCOW_BASE_URL}/api/v1/delete/mailbox`, {
          method: 'POST',
          headers: {
            'X-API-Key': MAILCOW_API_KEY!,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([email]),
        });

        const result = await response.json();
        console.log('Delete account result:', result);

        return new Response(JSON.stringify(result), {
          status: response.ok ? 200 : 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'change_password': {
        const { email, new_password } = await req.json();
        
        const response = await fetch(`${MAILCOW_BASE_URL}/api/v1/edit/mailbox`, {
          method: 'POST',
          headers: {
            'X-API-Key': MAILCOW_API_KEY!,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: [email],
            attr: {
              password: new_password,
              password2: new_password,
            }
          }),
        });

        const result = await response.json();
        console.log('Change password result:', result);

        return new Response(JSON.stringify(result), {
          status: response.ok ? 200 : 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error: any) {
    console.error('Error in mailcow-api function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

serve(handler);